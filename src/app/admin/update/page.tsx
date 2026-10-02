import AdminEventUpdatePage from '@/components/admin-panel-components/AdminEventUpdatePage';
import { detailedAllEventDataGET } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'
import z from 'zod';

type PageProps = {
    params: Promise<{ eventid: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const EventSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.date()
})

const page = async ({ searchParams }: PageProps) => {
    const { event } = await searchParams;
    if (!/^[a-zA-Z0-9]+$/.test(event as string)) {
        console.log("invalid slug")
        notFound();
    }
    const eventsData = await detailedAllEventDataGET(event as string);
    if (!eventsData.success) {
        console.log(eventsData);
        console.log("invalid slug")
        notFound();
    }
    const parsedEventSchema = EventSchema.parse(eventsData.data);
    return (
        <AdminEventUpdatePage previousData={parsedEventSchema} eventID={eventsData.data?.eventID!} url={eventsData.data?.bannerLink.url as string} />
    )
}

export default page