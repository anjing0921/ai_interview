"use client"
import React from 'react'
import { useUser } from '@stackframe/stack'
import { CoachingOptions } from '@/services/Options';
import Image from 'next/image';
import UserInputDialog from './UserInputDialog';

function FeatureAssistants() {
    const user = useUser();
    
    return (
        <div>
            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='font-medium text-gray-500'>My Workspace</h2>
                    <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName}</h2>
                </div>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 mt-10'>
                {CoachingOptions.map((option, index) => (
                    <div>
                        <UserInputDialog coachingOption={option}>
                            <div key={index}>
                                <Image src={option.icon} alt={option.name}
                                    width={210}
                                    height={180}
                                    className='h-[180px] w-[210px] hover:rotate-12 cursor-pointer transition-all'
                                />
                                <h2 className='mt-2 text-center'>{option.name}</h2>
                            </div>
                        </UserInputDialog>
                    </div>
                ))}
            </div>                        
        </div>
    )
}

export default FeatureAssistants
