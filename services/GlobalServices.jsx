import axios from "axios"
import OpenAI from "openai"
import { CoachingOptions } from "./Options";
import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai';
// import mime from 'mime';
// import { writeFile } from 'fs';
// import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";
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

export const AIModel = async (topic, coachingOption, msg) => {
    try {
        const option = CoachingOptions.find((item) => item.name === coachingOption);
        const PROMPT = option.prompt.replace('{user_topic}', topic);

        console.log(`msg: ${msg}`);

        const completion = await openai.chat.completions.create({
            model: "openai/chatgpt-4o-latest",
            messages: [
                { role: 'assistant', content: PROMPT },
                { role: 'user', content: msg },
            ],
        });

        console.log("AI response:", completion.choices[0].message);
        return completion.choices[0].message;  // <--- crucial
    } catch (err) {
        console.error("AIModel error:", err);
        throw err;  // rethrow so caller can catch
    }
}