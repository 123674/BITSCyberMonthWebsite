"use server";

import validate from "@/func/stringFunc";
import { addingEventToDbPOST, detailedAllEventDatabyIDGET, updatingEventToDbPATCH } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isValidAdminSession } from "@/lib/adminAuth";
import z, { success } from "zod";

// Server actions can be called directly, so each one re-checks the admin session.
const isAdmin = async (): Promise<boolean> => isValidAdminSession((await cookies()).get(ADMIN_COOKIE)?.value);
const NOT_ADMIN = { success: false, error: { metaError: ['Admin login required.'] } };

// ImageKit rejects uploads with this message when its API keys are wrong or missing.
const imageUploadErrorMessage = (e: unknown): string | null =>
    typeof e === 'object' && e !== null && 'message' in e && /cannot be authenticated/i.test(String(e.message))
        ? 'Poster upload failed: the ImageKit keys in the server settings are not valid.'
        : null;

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
    startDate: z.string().refine((st) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(st)),
    eventPoster: z.instanceof(File).nullable()
        .refine((f) => !f || f.size > 1024, 'Logo must atleast 1kB')
        .refine((f) => !f || f.size < 1024 * 1024 * 1024, 'Logo must be less than 1MB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
})

const EventForDBUpdateSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    mode: z.enum(['Offline', 'Online', 'Mixed']).optional(),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']).optional(),
    formLink: z.url().optional(),
    contactDetails: z.string().optional(),
    paymentDetails: z.string().optional(),
    startDate: z.string().refine((st) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(st)).optional(),
    eventPoster: z.instanceof(File).optional().nullable()
        .refine((f) => !f || f.size > 1024, 'Logo must atleast 1kB')
        .refine((f) => !f || f.size < 1024 * 1024 * 1024, 'Logo must be less than 1MB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
    publish: z.boolean()
})



type EventType = z.infer<typeof EventSchema>
type EventForDBUpdateType = z.infer<typeof EventForDBUpdateSchema>



export const addEvent = async (formData: EventType, publish : boolean) => {
    if (!(await isAdmin())) return NOT_ADMIN;
    // redis validation
    let redir : string = '';
    try {
        const parsedFormData = EventSchema.safeParse(formData);
        if (!parsedFormData.success) {
            return { error: z.flattenError(parsedFormData.error).fieldErrors, success: false }
        }
        // A new event needs a poster: it is uploaded as the event's banner.
        if (!parsedFormData.data.eventPoster) {
            return { error: { eventPoster: ['Please upload an event poster.'] }, success: false }
        }


        const validTitle = validate(parsedFormData.data.title);
        const validDesc = validate(parsedFormData.data.description);
        const validLoc = validate(parsedFormData.data.location);
        const validContactDetails = validate(parsedFormData.data.contactDetails);
        const validPaymentDetails = validate(parsedFormData.data.paymentDetails);

        if(!validTitle.valid) {
            return { error: {title : [validTitle.error]}, success: false }
        }
        if(!validDesc.valid) {
            return { error: {title : [validDesc.error]}, success: false }
        }
        if(!validLoc.valid) {
            return { error: {title : [validLoc.error]}, success: false }
        }
        if(!validContactDetails.valid) {
            return { error: {title : [validContactDetails.error]}, success: false }
        }
        if(!validPaymentDetails.valid) {
            return { error: {title : [validPaymentDetails.error]}, success: false }
        }

        const validEvent : EventType & {publish : boolean} = { 
            ...parsedFormData.data,
            title: validTitle.value!, 
            description: validDesc.value!, 
            location: validLoc.value!,
            contactDetails: validContactDetails.value!, 
            paymentDetails: validPaymentDetails.value!, 
            publish
        }
        
        redir = await addingEventToDbPOST(validEvent);
        return {success : true}

    } catch (e) {
        console.log("Error during Event Creation : ", e);
        return { success: false, error: { metaError: [imageUploadErrorMessage(e) ?? 'Something went wrong! Try again later.'] } }
    }
    redir ? redirect(`/events/${redir}?preview=true`) : null
}

export const updateEvent = async (formData: EventType,rawEventID : string, publish : boolean) => {
    if (!(await isAdmin())) return NOT_ADMIN;
    // redis validation
    let redir : string = '';
    try {
        const parsedFormData = EventSchema.safeParse(formData);
        if (!parsedFormData.success) {
            return { error: z.flattenError(parsedFormData.error).fieldErrors, success: false }
        }
        
        const eventID = z.uuid().parse(rawEventID);
        const eventData = await detailedAllEventDatabyIDGET(eventID);
        if (!eventData.success || !eventData.data) {
            return { success: false, error: { metaError: ["Event not found."] } }
        }
        
        
        const validTitle = validate(parsedFormData.data.title);
        const validDesc = validate(parsedFormData.data.description);
        const validLoc = validate(parsedFormData.data.location);
        const validContactDetails = validate(parsedFormData.data.contactDetails);
        const validPaymentDetails = validate(parsedFormData.data.paymentDetails);
        
        if(!validTitle.valid) {
            return { error: {title : [validTitle.error]}, success: false }
        }
        if(!validDesc.valid) {
            return { error: {title : [validDesc.error]}, success: false }
        }
        if(!validLoc.valid) {
            return { error: {title : [validLoc.error]}, success: false }
        }
        if(!validContactDetails.valid) {
            return { error: {title : [validContactDetails.error]}, success: false }
        }
        if(!validPaymentDetails.valid) {
            return { error: {title : [validPaymentDetails.error]}, success: false }
        }

        const validEvent : EventForDBUpdateType = {publish};
        if(validTitle.value !== eventData.data?.title) {
            validEvent.title = validTitle.value
        }
        if(validDesc.value !== eventData.data?.description) {
            validEvent.description = validDesc.value
        }
        if(validLoc.value !== eventData.data?.location) {
            validEvent.location = validLoc.value
        }
        if(validContactDetails.value !== eventData.data?.contactDetails) {
            validEvent.contactDetails = validContactDetails.value
        }
        if(validPaymentDetails.value !== eventData.data?.paymentDetails) {
            validEvent.paymentDetails = validPaymentDetails.value
        }
        if(parsedFormData.data.mode !== eventData.data?.mode) {
            validEvent.mode = parsedFormData.data.mode
        }
        if(parsedFormData.data.eventType !== eventData.data?.eventType) {
            validEvent.eventType = parsedFormData.data.eventType
        }
        if(parsedFormData.data.formLink !== eventData.data?.formLink) {
            validEvent.formLink = parsedFormData.data.formLink
        }
        if(parsedFormData.data.startDate !== eventData.data.startDate.toISOString()) {
            validEvent.startDate = parsedFormData.data.startDate
        }
        if(parsedFormData.data.eventPoster) {
            validEvent.eventPoster = parsedFormData.data.eventPoster
        }
        
        console.log("final",validEvent);
        redir = await updatingEventToDbPATCH(validEvent,eventID);

    } catch (e) {
        console.log("Error during Event Creation : ", e);
        return { success: false, error: { metaError: [imageUploadErrorMessage(e) ?? 'Something went wrong! Try again later.'] } }
    }
    redir ? redirect(`/events/${redir}?preview=true`) : null
}
