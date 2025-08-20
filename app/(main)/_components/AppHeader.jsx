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
            <h2>
                let's sharp your interview 
            </h2>
            <UserButton/>
            
        </div>
    )
}

export default AppHeader
