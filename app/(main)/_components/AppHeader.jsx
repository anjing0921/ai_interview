import React from 'react'
import Image from 'next/image'
import { UserButton } from '@stackframe/stack'

function AppHeader() {
    return (
        <div className='p-3 shadow-sm flex justify-between items-center px-10'>
            <Image src={'/logo.svg'} alt='logo'
                    width={120}
                    height={160}
            />
            <div>
                <h2 className='text-3xl font-bold text-primary'>
                    let's sharp your interview 
                </h2>
            </div>
            <UserButton/>
            
        </div>
    )
}

export default AppHeader
