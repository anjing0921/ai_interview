"use client"
import Image from "next/image";
import { Button } from '@/components/ui/button'
import AppHeader from "./(main)/_components/AppHeader";
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter();
    
    const OnClickSignOn = () => {
        console.log("Button clicked!")
        router.push("/handler/sign-up")
    }

    return (
        
        <div>
            <AppHeader/>
            <div className="relative  w-full">
                {/* <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center" >
                    <Button >Get started</Button>
                </div> */}
                <Image src={'/AI-interview.png'} alt='AI ace your interview'    
                                            width={1410}
                                            height={760}
                                            className="w-full h-auto"/>
                <div className="absolute top-30 left-1/2 -translate-x-1/2" >
                    <Button 
                    onClick={OnClickSignOn}
                    >Get started</Button>
                </div>
                
            </div>
        </div>
    );
}
