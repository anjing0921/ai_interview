"use client"
import React from 'react'
import { useUser } from '@stackframe/stack'
import { Button } from '@/components/ui/button';
import { ExpertsList } from '@/services/Options';
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
                <Button>Profile</Button>
            </div>

            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 mt-10'>
                {ExpertsList.map((option, index) => (
                    <div>
                        <UserInputDialog></UserInputDialog>
                        <div key={index}>
                            <Image src={option.icon} alt={option.name}
                                width={210}
                                height={180}
                                className='h-[180px] w-[210px] hover:rotate-12 cursor-pointer transition-all'
                            />
                            <h2 className='mt-2'>{option.name}</h2>
                        </div>
                    </div>
                ))}
            </div>                        
        </div>
    )
}

export default FeatureAssistants
