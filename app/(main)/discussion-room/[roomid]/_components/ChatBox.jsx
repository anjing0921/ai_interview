import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
import { useMutation } from 'convex/react';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
// import ReactMarkdown from 'react-markdown';
// import { toast } from 'sonner';


function ChatBox({conversation}) {
    return (
        <div>
            <div className='h-[60vh] bg-secondary border rounded-xl flex flex-col  
                    relative p-4 overflow-auto scrollbar-hide'>
                    <div>
                        {conversation.map((item, index) => (
                            <div key={index} className={`flex ${item?.role == 'user' && 'justify-end'}`}>
                                {item?.role == 'assistant' ?
                                <h2 className='p-1 px-2 bg-primary mt-2 text-white inline-block rounded-md'>
                                    {item?.content}
                                </h2>
                                :
                                <h2 className='p-1 px-2 bg-gray-200 mt-2 inline-block rounded-md justify-end'>{item?.content}</h2>}
                    </div>

                        ))}
                    </div>
                    
            </div>
            <h2 className='mt-4 text-gray-400 '>At the end</h2>
        
        </div>
    )
}

export default ChatBox
