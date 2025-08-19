"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { AIModel, ConvertTextToSpeech, getToken } from '@/services/GlobalServices';
import { StreamingTranscriber } from "assemblyai";
import { Readable } from "stream";
import { Loader2Icon } from 'lucide-react';
import ChatBox from './_components/ChatBox';
import { toast } from 'sonner';

function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const recorder = useRef(null)
    const streamingTranscriber = useRef(null);
    const [transcribe, setTranscribe] = useState();
    const [conversation, setConversation] = useState([
            { role: 'assistant', content: "hi" },
            { role: 'user', content: "hello" },
        ]);
    const [loading, setLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState();
    const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
    const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation)
    const updateUserToken = useMutation(api.users.UpdateUserToken)
    let silenceTimeout;
    let waitForPause;
    let texts = {};
    

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = CoachingExpert.find(item => item.name == DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData])

    const connectToServer = async () => {
        setEnableMic(true);
        setLoading(true);
        // Step 1: Fetch a fresh token every time you connect.
        const {token}= await getToken();
        if (!token) {
            console.error("Failed to get a valid token. Cannot connect.");
            setEnableMic(false);
            return;
        }
        console.log("Fetched token:", token);

        // Init Assembly AI
        streamingTranscriber.current = new StreamingTranscriber({
            token,
            sampleRate: 16000,
            formatTurns: true,
            endOfTurnConfidenceThreshold: 0.7,
            minEndOfTurnSilenceWhenConfident: 160,
            maxTurnSilence: 2400
        })
        console.log(streamingTranscriber.current)

        // streamingTranscriber.current.on("open", ({id}) => {
        //     console.log(`Session opened with ID: ${id}`);
        // });

        // streamingTranscriber.current.on('transcript', async (transcript) => {
        //     console.log(transcript);
        // })

        streamingTranscriber.current.on("turn", async (turn) => {
            if (!turn.transcript) {
                return;
            }
            console.log("Turn:", turn);
            let msg = ''
            // 1. Add user message to chat
            if (turn.end_of_turn && turn.end_of_turn_confidence>=0.9) {
                console.log(turn.transcript)
                setConversation((prev) => [...prev, {
                    role: 'user',
                    content: turn.transcript
                }]); 
                console.log(`conversation=${conversation}`)
            }
            
            texts[turn.turn_order] = turn.transcript;
            console.log(texts)
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);

            for (const key of keys) {
                if (texts[key]) {
                    msg += `${texts[key]}`
                }
            }
            console.log(msg)
            setTranscribe(msg);
        });

        streamingTranscriber.current.on("error", (err) => {
            console.error("Realtime error:", err);
        });

        streamingTranscriber.current.on("close", (code, reason) => {
        console.log(`Connection closed. Code: ${code}, Reason: ${reason}`);
    });
        console.log("Connecting to streaming transcript service");
        await streamingTranscriber.current.connect();
        console.log("Starting recording");
        setLoading(false)
        toast('Connected...')
        if (typeof window !== "undefined" && typeof navigator !== "undefined") {
            const RecordRTC = (await import("recordrtc")).default; //Importing here
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    recorder.current = new RecordRTC(stream, {
                        type: 'audio',
                        mimeType: 'audio/webm;codecs=pcm',
                        recorderType: RecordRTC.StereoAudioRecorder,
                        timeSlice: 250,
                        desiredSampRate: 16000,
                        numberOfAudioChannels: 1,
                        bufferSize: 4096,
                        audioBitsPerSecond: 128000,
                        ondataavailable: async (blob) => {
                            if (!streamingTranscriber.current) return;
                            // Reset the silence detection timer on audio input
                            clearTimeout(silenceTimeout);
                            const buffer = await blob.arrayBuffer();
                            // console.log(buffer)
                            streamingTranscriber.current.sendAudio(buffer);
                            // Readable.toWeb(buffer).pipeTo(streamingTranscriber.current.stream());

                            // Restart the silence detection timer
                            silenceTimeout = setTimeout(() => {
                                console.log('User stopped talking');
                                // Handle user stopped talking (e.g., send final transcript, stop recording, etc.)
                            }, 2000);
                        },
                    });
                    recorder.current.startRecording();
                })
                .catch((err) => console.error(err));
            }
    }
    
    useEffect(() => {
        // clearTimeout(waitForPause);
        async function fetchData() {
            if (conversation[conversation.length - 1]?.role == 'user') {
                // Calling AI text Model to Get Response
                const lastTwoMsg = conversation.slice(-2);
                const aiResp = await AIModel(
                    DiscussionRoomData.topic,
                    DiscussionRoomData.coachingOption,
                    lastTwoMsg);

                const url = await ConvertTextToSpeech(aiResp.content, DiscussionRoomData.expertName);
                console.log(url)
                setAudioUrl(url);
                setConversation(prev => [...prev, aiResp]);
                // await updateUserTokenMathod(aiResp.content);// Update AI generated TOKEN
            }
        }
        if (DiscussionRoomData) {
            fetchData();
        }
        

    }, [conversation])

    const disconnect = async (e) => {
        e.preventDefault();
        setLoading(true)
        await streamingTranscriber.current.close();
        // Check if the recorder instance exists before trying to use it
        if (recorder.current) {
            // Pause the recording
            recorder.current.pauseRecording();

            // Optional: you may want to destroy the recorder to free up resources
            // recorder.current.destroy();

            // After using it, set the reference to null
            recorder.current = null;
        }
        if (streamingTranscriber.current) {
            await streamingTranscriber.current.close();
            streamingTranscriber.current = null;
        }
        
        setEnableMic(false);
        toast('Disconnected!')
        await UpdateConversation({
            id: DiscussionRoomData._id,
            conversation: conversation
        })
        setLoading(false)
        setEnableFeedbackNotes(true);

    }
    
    return (
        <div className='-mt-12'>
            <h2 className='text-lg font-bold'>{DiscussionRoomData?.coachingOption}</h2>
            <div className='mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <div className=' lg:col-span-2'>
                    <div className='h-[60vh] bg-secondary border rounded-4xl
                    flex flex-col items-center justify-center relative'>
                        <Image src={expert?.avatar} alt='Avatar' width={200} height={200}
                            className='h-[80px] w-[80px] rounded-full object-cover animate-pulse'/>
                        <h2 className='text-gray-500'>{expert?.name}</h2>

                        <audio src={audioUrl} type="audio/mp3" autoPlay />
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>
                    <div className='mt-5 flex items-center justify-center'>
                        {!enableMic ? <Button onClick={connectToServer} disable ={loading}>
                        {loading && <Loader2Icon className='animate-spin' />}Connect</Button>
                        :
                        <Button variant="destructive" onClick={disconnect} disable ={loading}>
                            {loading && <Loader2Icon className='animate-spin' />}
                            Disconnect</Button>}
                    </div>
                </div>
                <ChatBox conversation={conversation}
                enableFeedbackNotes={enableFeedbackNotes}
                coachingOption={DiscussionRoomData?.coachingOption}
                />
                <h2 className='p-4 border rounded-2xl mt-5'>{transcribe}</h2>
            </div>
        </div>
    )
}

export default DiscussionRoom
