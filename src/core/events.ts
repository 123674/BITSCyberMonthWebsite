"use server";

import validate from "@/func/stringFunc";
import { addingEventToDbPOST, detailedAllEventDatabyIDGET, updatingEventToDbPATCH } from "@/lib/db";
import { redirect } from "next/navigation";
import z, { success } from "zod";
import { EventForDBUpdateSchema, EventFromFormSchema } from "./events.schema";






type EventType = z.infer<typeof EventFromFormSchema>
type EventForDBUpdateType = z.infer<typeof EventForDBUpdateSchema>



export const addEvent = async (formData: EventType, publish : boolean) => {
    // redis validation
    let redir : string = '';
    try {
        const parsedFormData = EventFromFormSchema.safeParse(formData);
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
        return {success : true}

    } catch (e) {
        console.log("Error during Event Creation : ", e);
        return { success: false, error: { metaError: 'Something went wrong!\nTry again later' } }
    }
    redir ? redirect(`/events/${redir}?preview=true`) : null
}

export const updateEvent = async (formData: EventType,rawEventID : string, publish : boolean) => {
    // redis validation
    let redir : string = '';
    try {
        const parsedFormData = EventFromFormSchema.safeParse(formData);
        if (!parsedFormData.success) {
            return { error: z.flattenError(parsedFormData.error).fieldErrors, success: false }
        }
        
        const eventID = z.uuid().parse(rawEventID);
        const eventData = await detailedAllEventDatabyIDGET(eventID);
        
        
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
        if(parsedFormData.data.formLink !== eventData.data?.formLink) {
            validEvent.formLink = parsedFormData.data.formLink
        }
        if(parsedFormData.data.startDate !== new Date(eventData.data?.startDate!).toISOString()) {
            validEvent.startDate = parsedFormData.data.startDate
        }
        if(parsedFormData.data.eventPoster) {
            validEvent.eventPoster = parsedFormData.data.eventPoster
        }
        
        console.log("final",validEvent);
        redir = await updatingEventToDbPATCH(validEvent,eventID);

    } catch (e) {
        console.log("Error during Event Creation : ", e);
        return { success: false, error: { metaError: 'Something went wrong!\nTry again later' } }
    }
    redir ? redirect(`/events/${redir}?preview=true`) : null
}

