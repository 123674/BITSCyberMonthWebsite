import React from 'react'
import SiteChrome from '@/components/site/SiteChrome';
import EventsDirectory from '@/components/events/EventsDirectory';
import { getPublishedEventCards } from '@/lib/eventCards';

export const dynamic = 'force-dynamic';

const page = async (): Promise<React.JSX.Element> => {
    const events = await getPublishedEventCards();

    return (
        <SiteChrome>
            <EventsDirectory events={events} />
        </SiteChrome>
    )
}

export default page
