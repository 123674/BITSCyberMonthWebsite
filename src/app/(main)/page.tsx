import HomeMainPage from '@/components/home/HomeMainPage';
import { EventFromBDBriefBreif } from '@/func/zodEventSchema';
import { briefPublishedEventsDataGET } from '@/lib/db';

// Reads events from the database on every request so the timeline stays current.



export default async function Page() {
    let timelineEvents: EventFromBDBriefBreif = [];
    try {
        timelineEvents = await briefPublishedEventsDataGET();
    } catch (e) {
        // If the database is unreachable, still show the homepage (with an empty timeline).
        console.log("Error loading timeline events : ", e);
    }
    return (<HomeMainPage timelineEvents={timelineEvents} /> )
    // return <HomePage timelineEvents={timelineEvents} />;
}
