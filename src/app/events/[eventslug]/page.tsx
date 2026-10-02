import { detailedPublishedEventDataGET } from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

type PageProps = {
  params: Promise<{ eventslug: string }>;
};


const page = async ({params} : PageProps): Promise<React.JSX.Element> => {
    const { eventslug } = await params;
    if(!/^[a-zA-Z0-9]+$/.test(eventslug)) {
        console.log("invalid slug")
        notFound();
    }
    const eventsData = await detailedPublishedEventDataGET(eventslug);

    return (
        <div>
            <Image
                src={eventsData.bannerLink.url}
                width={200}
                height={200}
                alt="Event Banner"
            />
        </div>
    )
}

export default page