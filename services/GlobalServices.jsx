import axios from "axios"
import OpenAI from "openai"
import { CoachingOptions } from "./Options";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
// import { ElevenLabsClient, play } from "elevenlabs";

export const getToken = async () => {
    // const result = await axios.get('/api/getToken');
    // console.log(result.data)
    const res = await fetch("/api/getToken");
    const data = await res.json()
    console.log(data)
    return data
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER,
    dangerouslyAllowBrowser: true
})

// const ai = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//   });
// const model = 'models/gemini-2.5-flash-preview-native-audio-dialog'

export const AIModel = async (topic, coachingOption, lastTwoMsg) => {
    try {
        const option = CoachingOptions.find((item) => item.name === coachingOption);
        const PROMPT = option.prompt.replace('{user_topic}', topic);

        console.log(`msg: ${lastTwoMsg}`);

        const completion = await openai.chat.completions.create({
            model: "openai/chatgpt-4o-latest",
            messages: [
                { role: 'assistant', content: PROMPT },
                ...lastTwoMsg
            ],
        });

        console.log("AI response:", completion.choices[0].message);
        return completion.choices[0].message;  // <--- crucial
    } catch (err) {
        console.error("AIModel error:", err);
        throw err;  // rethrow so caller can catch
    }




}

export const ConvertTextToSpeech = async (text, expertName) => {


    const pollyClient = new PollyClient({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECREAT_KEY
        }
    })

    const command = new SynthesizeSpeechCommand({
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: expertName
    })

    try {
        const { AudioStream } = await pollyClient.send(command);

        const audioArrayBuffer = await AudioStream.transformToByteArray();
        const audioBlob = new Blob([audioArrayBuffer], { type: 'audio/mp3' })

        const audioUrl = URL.createObjectURL(audioBlob);
        return audioUrl

    } catch (e) {
        console.log(e);
    }

}

export const AIModelToGenerateFeedbackAndNotes = async (coachingOption, conversation) => {

    const option = CoachingOptions.find((item) => item.name == coachingOption)
    const PROMPT = (option.summeryPrompt);

    const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
            ...conversation,
            { role: 'assistant', content: PROMPT },
        ],
    })
    // console.log(completion.choices[0].message)
    return completion?.choices[0]?.message;
}