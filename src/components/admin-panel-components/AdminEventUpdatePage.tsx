"use client";
import React, { useState } from 'react'
import Form from 'next/form';
import ErrorMessageDiv from '@/components/wide-spread-components/ErrorMessageDiv';
import z from 'zod';
import Image from 'next/image';
import { addEvent, updateEvent } from '@/core/events';

const allowedLogoFormat = new Set(['image/png', 'image/jpeg', 'image/webp']);
const EventSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.string().refine((stDate) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/.test(stDate), 'Invalid Date Format'),
    eventPoster: z.instanceof(File).nullable()
        .refine((f) => !f || f.size > 1024, 'Logo must atleast 1kB')
        .refine((f) => !f || f.size < 1024 * 1024 * 1024, 'Logo must be less than 1MB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
})

type EventType = z.infer<typeof EventSchema>

type EventFromDBType = {
 title: string;
 description: string;
 location: string;
 mode: "Offline" | "Online" | "Mixed";
 eventType: "Completed" | "OnGoing" | "Upcomming";
 formLink: string;
 contactDetails: string;
 paymentDetails: string;
 startDate: Date;
}

type FormResponseError = {
    metaError?: string[],
    title?: string[],
    description?: string[],
    eventPoster?: string[],
    location?: string[],
    mode?: string[],
    eventType?: string[],
    formLink?: string[],
    contactDetails?: string[],
    paymentDetails?: string[],
    startDate?: string[]
}

const toLocalISOString = (date = new Date()) => {
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, -1);
    return localISOTime; // "2026-09-05T14:30:00.000"
}

const AdminEventUpdatePage = ({previousData, url,eventID} : {previousData : EventFromDBType, url : string,eventID : string}) => {
    const [formResponseState, setFormResponseState] = useState<EventType>({...previousData,startDate : toLocalISOString(previousData.startDate),eventPoster : null});
    const [formResponseError, setFormResponseError] = useState<FormResponseError>({ metaError: [''], title: [''], description: [''], eventPoster: [''], location: [''], mode: [''], eventType: [''], formLink: [''], contactDetails: [''], paymentDetails: [''], startDate: [''] });
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [eventPosterPreview, setEventPosterPreview] = useState<string>(url);
    const handleChannlLogoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files![0]
        const parsedImage = EventSchema.shape.eventPoster.safeParse(file)
        if (!parsedImage.success) {
            setFormResponseError(prev => ({ ...prev, eventPoster: [parsedImage.error.issues[0]?.message] }));
            return;
        }
        setEventPosterPreview(URL.createObjectURL(file));
        setFormResponseState(prev => ({ ...prev, eventPoster: file }));
    }

    const handleFormSubmission = async (publish : boolean) => {
        const parsedFormData = EventSchema.safeParse(formResponseState);
        if (!parsedFormData.success) {
            setFormResponseError(z.flattenError(parsedFormData.error).fieldErrors as FormResponseError);
            return;
        }

        const res = await updateEvent({...parsedFormData.data,startDate : new Date(parsedFormData.data.startDate).toISOString()},eventID,publish);

        if (!res?.success) {
            setFormResponseError(res?.error as FormResponseError);
            console.log("error",res);
            return;
        }
        console.log("succes",res);
        setSuccessMessage('Event Creation Successfull');

    }

    return (
        <main>
            <Form action={() => { }} >
                {formResponseError?.metaError?.[0] && <ErrorMessageDiv message={formResponseError.metaError?.[0]} textSize={16} />}
                <fieldset>
                    <legend>Title</legend>
                    <input
                        type="text"
                        id="titleInputField"
                        value={formResponseState.title}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, title: e.target.value }))}
                    />
                    {formResponseError.title?.[0] && <ErrorMessageDiv message={formResponseError.title?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Description</legend>
                    <textarea
                        id="descriptionTextArea"
                        value={formResponseState.description}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, description: e.target.value }))}
                    />
                    {formResponseError.description?.[0] && <ErrorMessageDiv message={formResponseError.description?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <input
                        type='datetime-local'
                        value={formResponseState.startDate}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    {formResponseError.startDate?.[0] && <ErrorMessageDiv message={formResponseError.startDate?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        id="eventPosterInputField"
                        size={500 * 1024}
                        className="hidden"
                        onChange={(e) => handleChannlLogoChange(e)}
                    />
                    <span className="font-bold text-mutedheadings">Channel Logo</span>
                    <div className="flex gap-4 items-center mt-4">
                        <label htmlFor="eventPosterInputField" className="">
                            {eventPosterPreview ? <Image src={eventPosterPreview} className="" height={120} width={120} alt="Event Poster" /> :
                                <div className="">
                                    Upload
                                </div>}
                        </label>
                        <div className="flex flex-col text-[15.74px] ">
                            <h5 className="font-semibold">Upload the logo</h5>
                            <span>Choose a photo as your logo</span>
                            <span>Square aspect ratio work best</span>
                            <span className="rounded-full w-min whitespace-pre bg-background2 px-2 py-0.5">PNG ⋅ JPEG ⋅ WEBP</span>
                        </div>
                    </div>
                    {formResponseError?.eventPoster?.[0] && <ErrorMessageDiv message={formResponseError?.eventPoster[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Location</legend>
                    <input
                        type="text"
                        id="locationInputField"
                        value={formResponseState.location}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, location: e.target.value }))}
                    />
                    {formResponseError.location?.[0] && <ErrorMessageDiv message={formResponseError.location?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Mode</legend>
                    <button style={formResponseState.mode === 'Offline' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, mode: 'Offline' }))} type="button">Offline</button>
                    <button style={formResponseState.mode === 'Online' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, mode: 'Online' }))} type="button">Online</button>
                    <button style={formResponseState.mode === 'Mixed' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, mode: 'Mixed' }))} type="button">Mixed</button>
                    {formResponseError.mode?.[0] && <ErrorMessageDiv message={formResponseError.mode?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Event Status</legend>
                    <button style={formResponseState.eventType === 'Upcomming' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, eventType: 'Upcomming' }))} type="button">Upcomming</button>
                    <button style={formResponseState.eventType === 'OnGoing' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, eventType: 'OnGoing' }))} type="button">OnGoing</button>
                    <button style={formResponseState.eventType === 'Completed' ? { backgroundColor: 'red' } : {}} onClick={() => setFormResponseState(prev => ({ ...prev, eventType: 'Completed' }))} type="button">Completed</button>
                    {formResponseError.eventType?.[0] && <ErrorMessageDiv message={formResponseError.eventType?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Google Form Link</legend>
                    <input
                        type="text"
                        id="formLinkInputField"
                        value={formResponseState.formLink}
                        onChange={(e) => {
                            const isValidLink = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:[/?#]\S*)?$/.test(e.target.value);
                            setFormResponseError(prev => ({ ...prev, formLink: [isValidLink ? '' : 'Invalid Form Link'] }))
                            setFormResponseState(prev => ({ ...prev, formLink: e.target.value }))
                        }}
                    />
                    {formResponseError.formLink?.[0] && <ErrorMessageDiv message={formResponseError.formLink?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Contact Details</legend>
                    <textarea
                        id="contactDetailsTextArea"
                        value={formResponseState.contactDetails}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, contactDetails: e.target.value }))}
                    />
                    {formResponseError.contactDetails?.[0] && <ErrorMessageDiv message={formResponseError.contactDetails?.[0]} textSize={16} />}
                </fieldset>
                <fieldset>
                    <legend>Payment Details</legend>
                    <textarea
                        id="paymentDetailsTextArea"
                        value={formResponseState.paymentDetails}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, paymentDetails: e.target.value }))}
                    />
                    {formResponseError.paymentDetails?.[0] && <ErrorMessageDiv message={formResponseError.paymentDetails?.[0]} textSize={16} />}
                </fieldset>
                {successMessage && <ErrorMessageDiv message={successMessage} textSize={16} color='#05df72' />}
                <button type="button"  onClick={() => handleFormSubmission(false)} >Save Draft</button>
                <button type="button"  onClick={() => handleFormSubmission(true)} >Publish</button>
            </Form>
        </main>
    )
}

export default AdminEventUpdatePage;