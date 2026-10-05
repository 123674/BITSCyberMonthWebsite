import CyberSecurityEventShelf from '@/components/home/HomePage';
import EntranceIntro from '@/components/intro/EntranceIntro';
import { EventFromBDBriefBreif } from '@/func/zodEventSchema';
import { briefPublishedEventsDataGET } from '@/lib/db';
import { notFound } from 'next/navigation';

// Reads events from the database on every request so the timeline stays current.



export default async function Page() {
    let timelineEvents: EventFromBDBriefBreif = [];
    let eventFeedAvailable = Boolean(process.env.DATABASE_URL);

    if (eventFeedAvailable) {
        try {
            const rawData = await briefPublishedEventsDataGET();
            if(rawData === null) {
                return notFound();
            }
            timelineEvents = rawData;
        } catch (e) {
            eventFeedAvailable = false;
            console.error("Error loading timeline events:", e);
        }
    }

    timelineEvents.sort((event1,event2) => event2.startDate.getTime() - event1.startDate.getTime())
    return (
        <>
            <EntranceIntro />
            <CyberSecurityEventShelf timelineEvents={timelineEvents} eventFeedAvailable={eventFeedAvailable} />
        </>
    )
}
