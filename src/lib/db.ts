import z from "zod";
import { imagekit } from "./imagekit";
import { prisma } from "./prisma";
import { slugify } from "@/func/stringFunc";
import { Prisma } from "@/generated/prisma/browser";

type EventType = {
    title: string;
    description: string;
    location: string;
    mode: "Online" | "Offline" | "Mixed";
    eventType: "Completed" | "OnGoing" | "Upcomming";
    formLink: string;
    contactDetails: string;
    paymentDetails: string;
    startDate: string;
    eventPoster: File | null;
}

const VersionInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
})

const AITagSchema = z.object({
    name: z.string(),
    confidence: z.number(),
    source: z.string(),
})

const FileMetaSchema = z.object({
    fileId: z.string(),
    name: z.string(),
    size: z.number(),
    versionInfo: VersionInfoSchema.nullable(),
    filePath: z.string(),
    url: z.string(),
    fileType: z.string(),
    height: z.number().nullable(),
    width: z.number().nullable(),
    orientation: z.number().nullish(),
    thumbnailUrl: z.string().nullable(),
    AITags: z.array(AITagSchema).nullable(),
    description: z.string().nullable(),
})


const EventForDBSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.string().refine((st) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(st)),
    bannerLink : FileMetaSchema,
    eventSlug : z.string(),
    publish : z.boolean()
})
const EventFromDBSchema = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.date(),
    bannerLink : FileMetaSchema,
    eventSlug : z.string(),
    publish : z.boolean()
})

const EventFromBDBriefSchema = z.object({
    title: z.string(),
    eventID: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    startDate: z.date(),
    bannerLink : FileMetaSchema,
    eventSlug : z.string()
})

type ImageUploadReturnType = z.infer<typeof FileMetaSchema>


type PrismaClientOrTx = typeof prisma | Prisma.TransactionClient;

export const briefPublishedEventsDataGET = async () => {
    const rawData =  await prisma.events.findMany({
        where : {
            publish : true
        },
        select: {
            title : true,
            eventID: true,
            eventSlug : true,
            mode: true,
            bannerLink: true,
            startDate: true,
            eventType: true,
        }
    })

    return EventFromBDBriefSchema.parse(rawData)
}

export const briefAllEventsDataGET = async () => {
    const rawData =  await prisma.events.findMany({
        select: {
            eventID: true,
            eventSlug : true,
            title : true,
            mode: true,
            bannerLink: true,
            startDate: true,
            eventType: true,
        }
    })
    return z.array(EventFromBDBriefSchema).parse(rawData);
}

export const detailedPublishedEventDataGET = async (slug: string) => {
    const res = await prisma.events.findFirst({
        where: {
            eventSlug : { equals: slug, mode: "insensitive" },
            publish : true
        },
    })
    return EventFromDBSchema.parse(res);
}

export const detailedAllEventDataGET = async (slug: string) => {
    const res = await prisma.events.findFirst({
        where: {
            eventSlug : { equals: slug, mode: "insensitive" },
        },
    })
    return EventFromDBSchema.parse(res);
}



export const checkEventTxSlugExists = async (tx : PrismaClientOrTx,slug : string) => {
    return await prisma.events.findFirst({
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
    }
    return slug;
}

export const addingEventToDbPOST = async (eventData: EventType & {publish : boolean}) : Promise<string> => {
    return await prisma.$transaction(async (tx) =>  {
        const fileUploadMeta = await imagekit.upload({
            file: Buffer.from(await eventData.eventPoster!.arrayBuffer()),
            fileName: eventData.title + ".png",
            isPublished: true,
        })
        const fileUploadParsedMeta = FileMetaSchema.parse(fileUploadMeta);
        const eventSlug = await validateEventSlugGET(tx,eventData.title);
        const eventDbData = EventForDBSchema.parse({...eventData,bannerLink : fileUploadParsedMeta,eventSlug : eventSlug })
        await tx.events.create({
            data : eventDbData
        })

        return eventSlug;

    })

}