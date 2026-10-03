import React from 'react'

import { briefAllEventsDataGET } from '@/lib/db';
import AdminMainPage from '@/components/admin-panel-components/AdminMainPage';

export const dynamic = 'force-dynamic';

const page = async (): Promise<React.JSX.Element> => {
    const eventsData = await briefAllEventsDataGET();
    
    return <AdminMainPage eventsData={eventsData}  />
}

export default page