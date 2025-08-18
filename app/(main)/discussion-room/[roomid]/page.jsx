"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { getToken } from '@/services/GlobalServices';
import { RealtimeTranscriber } from 'assemblyai';
import { Readable } from "stream";
// import recorder from "node-record-lpcm16";
// const RecordRTC = dynamic(() => import("recordrtc"), { ssr: false });
// import RecordRTC from 'recordrtc';

function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const recorder = useRef(null)
    const realtimeTranscriber = useRef(null);
    let silenceTimeout;
    

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = CoachingExpert.find(item => item.name == DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData])

    const connectToServer = async () => {
        setEnableMic(true);
        // Step 1: Fetch a fresh token every time you connect.
        const token = await getToken();
        if (!token) {
            console.error("Failed to get a valid token. Cannot connect.");
            setEnableMic(false);
            return;
        }
        console.log("Fetched token successfully.");
        console.log(token)


        // Init Assembly AI
        realtimeTranscriber.current = new RealtimeTranscriber({
            token: await getToken(),
            sample_rate: 16_000
        })

        realtimeTranscriber.current.on("open", () => {
            console.log("Connected to AssemblyAI realtime API");
        });

        realtimeTranscriber.current.on('transcript', async (transcript) => {
            console.log(transcript);
        })

        realtimeTranscriber.current.on("error", (err) => {
            console.error("Realtime error:", err);
        });

        realtimeTranscriber.current.on("close", (code, reason) => {
        console.log(`Connection closed. Code: ${code}, Reason: ${reason}`);
    });
        
        await realtimeTranscriber.current.connect();
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
                            if (!realtimeTranscriber.current) return;
                            // Reset the silence detection timer on audio input
                            clearTimeout(silenceTimeout);
                            const buffer = await blob.arrayBuffer();
                            console.log(buffer)
                            realtimeTranscriber.current.sendAudio(buffer);

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

    const disconnect = async (e) => {
        e.preventDefault();
        // await realtimeTranscriber.current.close();
        // Check if the recorder instance exists before trying to use it
        if (recorder.current) {
            // Pause the recording
            recorder.current.pauseRecording();

            // Optional: you may want to destroy the recorder to free up resources
            // recorder.current.destroy();

            // After using it, set the reference to null
            recorder.current = null;
        }
        if (realtimeTranscriber.current) {
            await realtimeTranscriber.current.close();
            realtimeTranscriber.current = null;
        }
        // recorder.current.pauseRecording();
        // recorder.current = null;
        setEnableMic(false);

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
                        <div className='p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10'>
                            <UserButton />
                        </div>
                    </div>
                    <div className='mt-5 flex items-center justify-center'>
                        {!enableMic ? <Button onClick={connectToServer}> Connect</Button>
                        :
                        <Button variant="destructive" onClick={disconnect}>Disconnect</Button>}
                    </div>
                </div>
                <div className='h-[60vh] bg-secondary border rounded-4xl
                flex flex-col items-center justify-center relative'>
                    <h2>Chat section</h2>
                </div>
                <h2 className='mt-4 text-gray-400 '>At the end</h2>
            </div>
        </div>
    )
}

export default DiscussionRoom
