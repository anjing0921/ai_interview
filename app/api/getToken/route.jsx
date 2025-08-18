import { AssemblyAI } from "assemblyai"
import { NextResponse } from "next/server";

const assemblyAi = new AssemblyAI({ apiKey: process.env.ASSEMBLY_API_KEY })
export async function GET(req) {
    try {
        const token = await assemblyAi.streaming.createTemporaryToken({
            expires_in_seconds: 60
        });
        return NextResponse.json({ token }); // Ensure you return a JSON object with a 'token' property
    } catch (error) {
        console.error("Error creating token:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}

// const token = await client.streaming.createTemporaryToken({ expires_in_seconds: 60 });

