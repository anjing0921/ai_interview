import axios from "axios"

export const getToken = async () => {
    // const result = await axios.get('/api/getToken');
    // console.log(result.data)
    const res = await fetch("/api/getToken");
    const data = await res.json()
    console.log(data)
    return data
}

export const AIModel = async (topic, coachingOption, lastTwoConversation) => {

    const option = CoachingOptions.find((item) => item.name == coachingOption)
    const PROMPT = (option.prompt).replace('{user_topic}', topic)

    const completion = await openai.chat.completions.create({
        model: "openai/gpt-4o-mini",
        messages: [
            { role: 'assistant', content: PROMPT },
            ...lastTwoConversation
        ],
    })
    // console.log(completion.choices[0].message)
    return completion?.choices[0]?.message;
}