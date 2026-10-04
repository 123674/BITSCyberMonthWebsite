import { EventFromBDBriefBreif } from '@/func/zodEventSchema';
import React from 'react'
import EventCard from './EventCard';

const EventsGrid = ({ timelineEvents }: { timelineEvents: EventFromBDBriefBreif }) => {
    console.log(timelineEvents);
    return (
        <div className='grid lg:grid-cols-3 gap-4'>
            {timelineEvents.map(event => (<div>
                <EventCard key={event.title} event={event} />
            </div>
            ))}
        </div>
    )
}

export default EventsGrid