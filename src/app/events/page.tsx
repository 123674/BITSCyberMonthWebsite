import { briefPublishedEventsDataGET } from '@/lib/db';
import React from 'react'

const page = async (): Promise<React.JSX.Element> => {
    const eventsData = await briefPublishedEventsDataGET();
    console.log(eventsData);
    return (
        <div>page</div>
    )
}

export default page