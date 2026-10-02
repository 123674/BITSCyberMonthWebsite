"use server";

import validate from "@/func/stringFunc";
import { addingEventToDbPOST } from "@/lib/db";
import { imagekit } from "@/lib/imagekit";
import { redirect } from "next/navigation";
import z from "zod";

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



type EventType = z.infer<typeof EventSchema>



export const addEvent = async (formData: EventType, publish : boolean) => {
    // redis validation
    let redir : string = '';
    try {
        const parsedFormData = EventSchema.safeParse(formData);
        if (!parsedFormData.success) {
            return { error: z.flattenError(parsedFormData.error).fieldErrors, success: false }
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

    } catch (e) {
        console.log("Error during Event Creation : ", e);
        return { success: false, error: { metaError: 'Something went wrong!\nTry again later' } }
    }
    redirect(`/events/${redir}?preview=true`);
}


