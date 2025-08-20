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
    
    const OnClickDashboard = () => {
        console.log("Button clicked! to Dashboard")
        router.push("/dashboard")
    }
    return (
        <div>
            <AppHeader/>
            <div className="relative  w-full">
                <Image src={'/AI-interview.png'} alt='AI ace your interview'    
                                            width={1410}
                                            height={760}
                                            className="w-full h-auto"/>
                <div className="absolute top-30 left-1/2 -translate-x-1/2" >
                    <Button 
                    onClick={OnClickSignOn}
                    >Get started</Button>
                </div>
                <div className="absolute top-20 left-1/2 -translate-x-1/2" >
                    <Button 
                    onClick={OnClickDashboard}
                    >Open your dashboard</Button>
                </div>

            </div>
        </div>
    );
}
