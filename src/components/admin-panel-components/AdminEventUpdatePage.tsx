"use client";
import React, { useState } from 'react'
import Form from 'next/form';
import ErrorMessageDiv from '@/components/wide-spread-components/ErrorMessageDiv';
import z from 'zod';
import Image from 'next/image';
import { addEvent, updateEvent } from '@/core/events';
import { EventDSPFType, EventSchemaDSPF, EventSchemaDSPFTLocal, EventTypeDDPLWithoutlug } from '@/func/zodEventSchema';


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
    endDate?: string[]
}

const toLocalISOString = (date = new Date()) => {
    const offsetMs = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offsetMs).toISOString().slice(0, -1);
    return localISOTime; // "2026-09-05T14:30:00.000"
}

const AdminEventUpdatePage = ({previousData, url,eventID} : {previousData : EventTypeDDPLWithoutlug, url : string,eventID : string}) => {
    const [formResponseState, setFormResponseState] = useState<EventDSPFType>({...previousData,startDate : toLocalISOString(previousData.startDate),endDate : toLocalISOString(previousData.endDate),eventPoster : null});
    const [formResponseError, setFormResponseError] = useState<FormResponseError>({ metaError: [''], title: [''], description: [''], eventPoster: [''], location: [''], mode: [''], eventType: [''], formLink: [''], contactDetails: [''], paymentDetails: [''], startDate: [''],endDate: [''] });
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [eventPosterPreview, setEventPosterPreview] = useState<string>(url);
    const handleChannlLogoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files![0]
        const parsedImage = EventSchemaDSPF.shape.eventPoster.safeParse(file)
        if (!parsedImage.success) {
            setFormResponseError(prev => ({ ...prev, eventPoster: [parsedImage.error.issues[0]?.message] }));
            return;
        }
        setEventPosterPreview(URL.createObjectURL(file));
        setFormResponseState(prev => ({ ...prev, eventPoster: file }));
    }

    const handleFormSubmission = async (publish : boolean) => {
        const parsedFormData = EventSchemaDSPFTLocal.safeParse(formResponseState);
        if (!parsedFormData.success) {
            setFormResponseError(z.flattenError(parsedFormData.error).fieldErrors as FormResponseError);
            return;
        }

        const res = await updateEvent({...parsedFormData.data,startDate : new Date(parsedFormData.data.startDate).toISOString(),endDate : new Date(parsedFormData.data.endDate).toISOString()},eventID,publish);

        if (!res?.success) {
            setFormResponseError(res?.error as FormResponseError);
            console.log("error",res);
            return;
        }
        console.log("succes",res);
        setSuccessMessage('Event Creation Successfull');

    }

    return (
        <main className="min-h-screen bg-black py-16 text-white">
            <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(177,77,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(177,77,255,0.05)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
            <Form action={() => { }} className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8 rounded-xl border border-border-green bg-black-2/80 p-8 shadow-[0_0_60px_rgba(177,77,255,0.1)] backdrop-blur-md">
                <header>
                    <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan">{"// edit_mission"}</p>
                    <h1 className="mt-2 font-headings text-3xl font-bold tracking-tight">Update <span className="text-green-bright">Event</span></h1>
                </header>

                {formResponseError?.metaError?.[0] && <ErrorMessageDiv message={formResponseError.metaError?.[0]} textSize={16} />}
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Title</legend>
                    <input
                        type="text"
                        id="titleInputField"
                        value={formResponseState.title}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, title: e.target.value }))}
                        className="rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.title?.[0] && <ErrorMessageDiv message={formResponseError.title?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Description</legend>
                    <textarea
                        id="descriptionTextArea"
                        value={formResponseState.description}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-28 rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.description?.[0] && <ErrorMessageDiv message={formResponseError.description?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Start Date</legend>
                    <input
                        type='datetime-local'
                        value={formResponseState.startDate}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, startDate: e.target.value }))}
                        className="rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.startDate?.[0] && <ErrorMessageDiv message={formResponseError.startDate?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">End Date</legend>
                    <input
                        type='datetime-local'
                        value={formResponseState.endDate}
                        min={new Date().toISOString().slice(0, 16)}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, endDate: e.target.value }))}
                        className="rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.endDate?.[0] && <ErrorMessageDiv message={formResponseError.endDate?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Event Poster</legend>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        id="eventPosterInputField"
                        size={500 * 1024}
                        className="hidden"
                        onChange={(e) => handleChannlLogoChange(e)}
                    />
                    <div className="flex items-center gap-4">
                        <label htmlFor="eventPosterInputField" className="cursor-pointer">
                            {eventPosterPreview ? <Image src={eventPosterPreview} height={120} width={120} alt="Event Poster" className="rounded-md border border-border-green object-cover" /> :
                                <div className="grid size-[120px] place-items-center rounded-md border border-dashed border-border-green font-mono text-[11px] uppercase tracking-widest text-muted-2 transition-colors hover:border-green-bright/60 hover:text-green-bright">
                                    Upload
                                </div>}
                        </label>
                        <div className="flex flex-col gap-1 text-sm text-muted">
                            <h5 className="font-semibold text-white">Upload the poster</h5>
                            <span>Choose a photo for your event</span>
                            <span className="w-min whitespace-pre rounded-full bg-green-bg px-2 py-0.5 font-mono text-[10px] text-green-bright">PNG ⋅ JPEG ⋅ WEBP</span>
                        </div>
                    </div>
                    {formResponseError?.eventPoster?.[0] && <ErrorMessageDiv message={formResponseError?.eventPoster[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Location</legend>
                    <input
                        type="text"
                        id="locationInputField"
                        value={formResponseState.location}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, location: e.target.value }))}
                        className="rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.location?.[0] && <ErrorMessageDiv message={formResponseError.location?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Mode</legend>
                    <div className="flex gap-3">
                        {(['Offline', 'Online', 'Mixed'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => setFormResponseState(prev => ({ ...prev, mode: m }))}
                                type="button"
                                className={`cursor-pointer rounded-md border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${formResponseState.mode === m ? 'border-green-bright bg-green-bright/10 text-green-bright' : 'border-white/10 text-muted hover:border-green-bright/40'}`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                    {formResponseError.mode?.[0] && <ErrorMessageDiv message={formResponseError.mode?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Google Form Link</legend>
                    <input
                        type="text"
                        id="formLinkInputField"
                        value={formResponseState.formLink}
                        onChange={(e) => {
                            const isValidLink = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d{2,5})?(?:[/?#]\S*)?$/.test(e.target.value);
                            setFormResponseError(prev => ({ ...prev, formLink: [isValidLink ? '' : 'Invalid Form Link'] }))
                            setFormResponseState(prev => ({ ...prev, formLink: e.target.value }))
                        }}
                        className="rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.formLink?.[0] && <ErrorMessageDiv message={formResponseError.formLink?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Contact Details</legend>
                    <textarea
                        id="contactDetailsTextArea"
                        value={formResponseState.contactDetails}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, contactDetails: e.target.value }))}
                        className="min-h-24 rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.contactDetails?.[0] && <ErrorMessageDiv message={formResponseError.contactDetails?.[0]} textSize={16} />}
                </fieldset>
                <fieldset className="flex flex-col gap-2">
                    <legend className="font-mono text-[11px] uppercase tracking-widest text-green-bright">Payment Details</legend>
                    <textarea
                        id="paymentDetailsTextArea"
                        value={formResponseState.paymentDetails}
                        onChange={(e) => setFormResponseState(prev => ({ ...prev, paymentDetails: e.target.value }))}
                        className="min-h-24 rounded-md border border-border-green bg-black px-4 py-2.5 font-mono text-sm text-white focus:border-green-bright/60 focus:outline-none"
                    />
                    {formResponseError.paymentDetails?.[0] && <ErrorMessageDiv message={formResponseError.paymentDetails?.[0]} textSize={16} />}
                </fieldset>
                {successMessage && <ErrorMessageDiv message={successMessage} textSize={16} color='#b14dff' />}
                <div className="flex gap-4">
                    <button type="button" onClick={() => handleFormSubmission(false)} className="cursor-pointer rounded-md border border-white/15 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-green-bright/40 hover:text-green-bright">Save Draft</button>
                    <button type="button" onClick={() => handleFormSubmission(true)} className="cursor-pointer rounded-md bg-green-bright px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(177,77,255,0.5)]">Publish</button>
                </div>
            </Form>
        </main>
    )
}

export default AdminEventUpdatePage;