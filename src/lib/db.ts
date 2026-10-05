import z, { success } from "zod";
import { getImageKit } from "./imagekit";
import { prisma } from "./prisma";
import { slugify } from "@/func/stringFunc";
import { Prisma } from "@/generated/prisma/browser";
import { EventDSPFType, EventFromBDBriefBreif, EventFromBDBriefSchema, EventSchemaDDPLWithSlugWithID, EventSchemaDSPL, EventSchemaDSPLWithoutSlug, EventSchemaDSPLWithoutSlugOptional, EventSchemaForDBDSPF, FileMetaSchema, ImageUploadReturnType } from "@/func/zodEventSchema";

type PrismaClientOrTx = typeof prisma | Prisma.TransactionClient;

export const briefPublishedEventsDataGET = async () : Promise<EventFromBDBriefBreif | null> => {
    
    const rawData = await prisma.events.findMany({
        where: {
            publish: true
        },
        select: {
            title: true,
            eventID: true,
            eventSlug: true,
            mode: true,
            bannerLink: true,
            startDate: true,
            endDate : true,
            description : true,
            location : true,
        }
    })

    const parsedRes = EventFromBDBriefSchema.safeParse(rawData);
    if(!parsedRes.success) {
        return null;
    }
    return parsedRes.data!;
}

export const briefAllEventsDataGET = async () => {
    const rawData = await prisma.events.findMany({
        select: {
            eventID: true,
            eventSlug: true,
            title: true,
            mode: true,
            bannerLink: true,
            startDate: true,
            endDate : true,
            description : true,
            location : true
        }
    })
    return EventFromBDBriefSchema.parse(rawData);
}

export const detailedPublishedEventDataGET = async (slug: string) => {
    const res = await prisma.events.findFirst({
        where: {
            eventSlug: { equals: slug, mode: "insensitive" },
            publish: true
        },
    })
    return EventSchemaDDPLWithSlugWithID.parse(res);
}

export const detailedAllEventDataGET = async (slug: string) => {
    try {
        const res = await prisma.events.findFirst({
            where: {
                eventSlug: { equals: slug, mode: "insensitive" },
            },
        })
        return { data: EventSchemaDDPLWithSlugWithID.parse(res), success: true };
    } catch (e) {
        console.log("Error during admin event detail GET : ", e);
        return { success: false, error: 'No Event Data found' }
    }
}
export const detailedAllEventDatabyIDGET = async (eventID: string) => {
    try {
        const res = await prisma.events.findFirst({
            where: {
                eventID
            },
        })
        return { data: EventSchemaDDPLWithSlugWithID.parse(res), success: true };
    } catch (e) {
        console.log("Error during admin event detail by ID GET : ", e);
        return { success: false, error: 'No Event Data found' }
    }
}



export const checkEventTxSlugExists = async (tx: PrismaClientOrTx, slug: string) => {
    return await tx.events.findFirst({
        where: { eventSlug: { equals: slug, mode: "insensitive" } },
        select: { eventID: true }
    })
}

const validateEventSlugGET = async (tx: PrismaClientOrTx, eventTitle: string): Promise<string> => {
    const base = slugify(eventTitle);
    let slug = base;
    let counter = 1;
    while (await checkEventTxSlugExists(tx, slug)) {
        slug = `${base}${counter}`
        counter += 1
    }
    return slug;
}

export const addingEventToDbPOST = async (eventData: EventDSPFType & { publish: boolean }): Promise<string> => {
    return await prisma.$transaction(async (tx) => {
        const fileUploadMeta = await getImageKit().upload({
            file: Buffer.from(await eventData.eventPoster!.arrayBuffer()),
            fileName: eventData.title + ".png",
            isPublished: true,
        })
        const fileUploadParsedMeta = FileMetaSchema.parse(fileUploadMeta);
        const eventSlug = await validateEventSlugGET(tx, eventData.title);
        const eventDbData = EventSchemaDSPL.parse({ ...eventData, bannerLink: fileUploadParsedMeta, eventSlug: eventSlug })
        await tx.events.create({
            data: eventDbData
        })

        return eventSlug;

    })

}

type EventForDBUpdateType = z.infer<typeof EventSchemaForDBDSPF>


export const updatingEventToDbPATCH = async (eventData: EventForDBUpdateType, eventID: string): Promise<string> => {
    return await prisma.$transaction(async (tx) => {
        let fileUploadParsedMeta: ImageUploadReturnType | null = null;
        if (eventData.eventPoster) {
            const fileUploadMeta = await getImageKit().upload({
                file: Buffer.from(await eventData.eventPoster!.arrayBuffer()),
                fileName: eventData.title + ".png",
                isPublished: true,
            })
            fileUploadParsedMeta = FileMetaSchema.parse(fileUploadMeta);
        }
        const eventDbData = EventSchemaDSPLWithoutSlugOptional.parse({
            ...eventData,
            ...(fileUploadParsedMeta ? { bannerLink: fileUploadParsedMeta } : {}),
        })
        const res = await tx.events.update({
            where: {
                eventID
            },
            data: eventDbData, select: {
                eventSlug: true
            }
        })
        return res.eventSlug
    })

}

type UserOAuthSignInType = {
    emailEncrypted: string,
    emailAuthTag: string,
    emailIv: string,
    emailKeyVersion: number,
    userNameEncrypted: string,
    userNameAuthTag: string,
    userNameIv: string,
    userNameKeyVersion: number,
    emailBlindIndex: string,
    emailVerified: boolean,
}


export const logOAuthUser = async (userID: string, userdata: UserOAuthSignInType) => {
    try {
        const result = await prisma.admin.update({
            where: { emailBlindIndex: userdata.emailBlindIndex },
            data: userdata,
            select : {
                adminID : true,
                emailVerified : true
            }
        })
        return result;
    } catch (e) {
        throw new Error("Storing UserData From OAuth Error : "+e);
    }
}