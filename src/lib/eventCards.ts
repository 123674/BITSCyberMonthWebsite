import { briefPublishedEventsDataGET } from '@/lib/db';

// Plain, serialisable event summary passed from server pages to client components.
export type EventCardData = {
    eventID: string;
    eventSlug: string;
    title: string;
    mode: "Offline" | "Online" | "Mixed";
    eventType: "Completed" | "OnGoing" | "Upcomming";
    startDate: string; // ISO string
    bannerUrl: string | null;
};

export const getPublishedEventCards = async (): Promise<EventCardData[]> => {
    const eventsData = await briefPublishedEventsDataGET();
    return eventsData.map((event) => ({
        eventID: event.eventID,
        eventSlug: event.eventSlug,
        title: event.title,
        mode: event.mode,
        eventType: event.eventType,
        startDate: event.startDate.toISOString(),
        bannerUrl: event.bannerLink.url || null,
    }));
};
