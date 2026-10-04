import EventPage from '@/components/events/EventsPage';
import { detailedPublishedEventDataGET } from '@/lib/db';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react'

export const dynamic = 'force-dynamic';

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

    console.log(eventsData);
    return (
        <EventPage event={eventsData} />
    )
}

export default page