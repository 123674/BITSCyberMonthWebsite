import HomePage from '@/components/home/HomePage';
import { getPublishedEventCards, type EventCardData } from '@/lib/eventCards';

// Reads events from the database on every request so the timeline stays current.
export const dynamic = 'force-dynamic';

export default async function Page() {
    let timelineEvents: EventCardData[] = [];
    try {
        timelineEvents = await getPublishedEventCards();
    } catch (e) {
        // If the database is unreachable, still show the homepage (with an empty timeline).
        console.log("Error loading timeline events : ", e);
    }
    return <HomePage timelineEvents={timelineEvents} />;
}
