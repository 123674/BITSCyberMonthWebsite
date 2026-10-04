import AdminEventUpdatePage from '@/components/admin-panel-components/AdminEventUpdatePage';
import { EventSchemaDDPLWithoutlug, EventSchemaDSPLWithoutSlug } from '@/func/zodEventSchema';
import { detailedAllEventDataGET } from '@/lib/db';
import { notFound } from 'next/navigation';
import React from 'react'
import z from 'zod';

type PageProps = {
    params: Promise<{ eventid: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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
    const parsedEventSchema = EventSchemaDDPLWithoutlug.parse(eventsData.data);
    return (
        <AdminEventUpdatePage previousData={parsedEventSchema} eventID={eventsData.data.eventID} url={eventsData.data.bannerLink.url} />
    )
}

export default Page