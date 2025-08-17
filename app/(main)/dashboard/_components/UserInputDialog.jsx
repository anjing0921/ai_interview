import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'


function UserInputDialog({children, coachingOption}) {
    return (
        <Dialog>
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{coachingOption.name}</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-3'>
                            <h2 className='text-black'>Enter a topic to master your skills in {coachingOption.name}</h2>
                            <Textarea placeholder="Enter your topic here..." className='mt-2'/>
                            <h2 className='text-black mt-5'>Select your coaching expert</h2>
                            <div>
                                {CoachingExpert.map((expert, index) => (
                                    <div key={index}>
                                        <Image src={expert.avatar} alt={expert.name}
                                            width={100}
                                            height={100}
                                            className={`rounded-2xl h-[80px] w-[80px] object-cover
                                            hover:scale-105 transition-all cursor-pointer p-1 border-primary
                                            
                                            `}
                                        />
                                    </div>

                                ))}
                                    


                                
                            </div>
                        </div>


                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialog
