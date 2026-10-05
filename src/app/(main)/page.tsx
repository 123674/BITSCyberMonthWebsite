import CyberSecurityEventShelf from '@/components/home/HomePage';
import { EventFromBDBriefBreif } from '@/func/zodEventSchema';
import { briefPublishedEventsDataGET } from '@/lib/db';
import { notFound } from 'next/navigation';

// Reads events from the database on every request so the timeline stays current.



export default async function Page() {
    let timelineEvents: EventFromBDBriefBreif = [];
    try {
        const rawData = await briefPublishedEventsDataGET();
        if(rawData === null) {
            return notFound();
        }
        timelineEvents= rawData;
    } catch (e) {
        // If the database is unreachable, still show the homepage (with an empty timeline).
        console.log("Error loading timeline events : ", e);
    }
    timelineEvents.sort((event1,event2) => event2.startDate.getTime() - event1.startDate.getTime())
    // return (<HomeMainPage timelineEvents={timelineEvents} /> )
    console.log(timelineEvents);
    return <CyberSecurityEventShelf timelineEvents={timelineEvents} />
    // return <HomePage  />;
}
