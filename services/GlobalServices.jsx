import axios from "axios"

export const getToken = async () => {
    // const result = await axios.get('/api/getToken');
    // console.log(result.data)
    const res = await fetch("/api/getToken");
    const data = await res.json()
    console.log(data)
    return data
}