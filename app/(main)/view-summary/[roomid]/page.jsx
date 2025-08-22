"use client"
import { api } from '@/convex/_generated/api';
import { CoachingOptions } from '@/services/Options';
import { useQuery } from 'convex/react';
import moment from 'moment';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'
import SummaryBox from '../_components/SummaryBox';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'

function ViewSummary() {
    const { roomid } = useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    console.log(DiscussionRoomData);
    const router = useRouter();

    const GetAbstractImages = (option) => {
        const coachingOption = CoachingOptions.find((item) => item.name == option)

        return coachingOption?.abstract ?? '/ab1.png';
    }

    const OnClickDashboard = () => {
        console.log("Button clicked! to Dashboard")
        router.push("/dashboard")
    }

    return (
        <div className='-mt-10'>
            <div className='flex justify-between items-end'>
                <div className='flex gap-7 items-center'>
                    <Image src={GetAbstractImages(DiscussionRoomData?.coachingOption)} alt='abstract'
                        width={100}
                        height={100}
                        className='w-[70px] h-[70px] rounded-full'
                    />
                    <div>
                        <h2 className='font-bold text-lg'>{DiscussionRoomData?.topic}</h2>
                        <h2 className='text-gray-400'>{DiscussionRoomData?.coachingOption}</h2>
                    </div>

                </div>
                <h2 className='text-gray-400 '>{moment(DiscussionRoomData?._creationTime).fromNow()}</h2>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5'>
                <div className='col-span-5'>
                    <div className='grid grid-cols-3'>
                        <h2 className='col-start-1 text-lg font-bold mb-6'>Summary of Your Conversation</h2>
                        <Button className='col-start-3' onClick={OnClickDashboard}>Back to Dashboard</Button>
                    </div>

                    <SummaryBox summary={DiscussionRoomData?.summary} />
                </div>
            </div>
        </div>
    )
}

export default ViewSummary