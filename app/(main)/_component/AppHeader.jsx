import React from 'react'
import Image from 'next/image'

function AppHeader() {
    return (
        <div>
            <Image src={'/logo.svg'} alt='logo'
                    width={160}
                    height={200}
                />
        </div>
    )
}

export default AppHeader
