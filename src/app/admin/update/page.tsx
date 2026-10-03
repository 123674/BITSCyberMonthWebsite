import AdminEventUpdatePage from '@/components/admin-panel-components/AdminEventUpdatePage';
import { detailedAllEventDataGET } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'
import z from 'zod';

export const dynamic = 'force-dynamic';

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

const Page = async ({ searchParams }: PageProps) => {
    const { event } = await searchParams;
    if (typeof event !== "string" || !/^[a-zA-Z0-9]+$/.test(event)) {
        console.log("invalid slug")
        notFound();
    }
    const eventsData = await detailedAllEventDataGET(event);
    if (!eventsData.success || !eventsData.data) {
        console.log(eventsData);
        console.log("invalid slug")
        notFound();
    }
    const parsedEventSchema = EventSchema.parse(eventsData.data);
    return (
        <AdminEventUpdatePage previousData={parsedEventSchema} eventID={eventsData.data.eventID} url={eventsData.data.bannerLink.url} />
    )
}

export default Page