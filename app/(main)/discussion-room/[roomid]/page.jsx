"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { CoachingExpert } from '@/services/Options';
import Image from 'next/image';
import { UserButton } from '@stackframe/stack';
import { Button } from '@/components/ui/button';


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
                        <Button>Connect</Button>
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
