"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';


function DiscussionRoom() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = CoachingExpert.find(item => item.name == DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData])
    
    return (
        <div>
            DiscussionRoom
        </div>
    )
}

export default DiscussionRoom
