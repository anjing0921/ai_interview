import Image from "next/image";
import { Button } from '@/components/ui/button'
import AppHeader from "./(main)/_components/AppHeader";

export default function Home() {
    return (
        
        <div>
            <AppHeader/>
            <div >
                <Image src={'/AI-interview.png'} alt='AI ace your interview'
                                                width={1210}
                                                height={1180}    
                                            />
                <Button >Get started</Button>
            </div>
            

        </div>
    );
}
