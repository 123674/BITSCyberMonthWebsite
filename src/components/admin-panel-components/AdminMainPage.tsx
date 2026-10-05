"use client";
import Link from 'next/link';
import React, { useState } from 'react'

type EventsDataType = {
    title: string,
    eventID: string,
    mode: "Offline" | "Online" | "Mixed",
    startDate: Date,
    bannerLink: {
        fileId: string,
        name: string,
        size: number,
        versionInfo: {
            id: string,
            name: string,
        } | null,
        filePath: string,
        url: string,
        fileType: string,
        height: number | null,
        width: number | null,
        thumbnailUrl: string | null,
        AITags: {
            name: string,
            confidence: number,
            source: string,
        }[] | null,
        description: string | null,
        orientation?: number | null | undefined,
    },
    eventSlug: string,
}[]

const AdminMainPage = ({ eventsData }: { eventsData: EventsDataType }) : React.JSX.Element => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [eventDataState, setEventDataState] = useState(eventsData);
    const handleQuerySearch = (searchQuery: string) => {

    }
    return (
        <main className='text-white'>
            <header>
                <h1>Your Events</h1>
                <p>Manage your events</p>
                <form 
                // action={logoutAction}
                >
                    <button type="submit">Log out</button>
                </form>
            </header>
            <div>
                <Link href={'./admin/add'}>
                    <button>Create</button>
                </Link>
            </div>
            <div>
                {eventDataState.length ? <div></div> : <div> No events found</div>}
            </div>
        </main>
    )
}

export default AdminMainPage