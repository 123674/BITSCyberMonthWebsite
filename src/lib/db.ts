import z, { success } from "zod";
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
    bannerLink: FileMetaSchema,
    eventSlug: z.string(),
    publish: z.boolean()
})

const allowedLogoFormat = new Set(['image/png', 'image/jpeg', 'image/webp']);


const EventForDBUpdateInputSchema = z.object({
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
    bannerLink: FileMetaSchema,
    publish: z.boolean()
})
const EventFromDBSchema = z.object({
    eventID: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.date(),
    bannerLink: FileMetaSchema,
    eventSlug: z.string(),
    publish: z.boolean()
})

const EventFromBDBriefSchema = z.object({
    title: z.string(),
    eventID: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    eventType: z.enum(['Completed', 'OnGoing', 'Upcomming']),
    startDate: z.date(),
    bannerLink: FileMetaSchema,
    eventSlug: z.string()
})

type ImageUploadReturnType = z.infer<typeof FileMetaSchema>


type PrismaClientOrTx = typeof prisma | Prisma.TransactionClient;

export const briefPublishedEventsDataGET = async () => {
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
            eventType: true,
        }
    })

    return EventFromBDBriefSchema.parse(rawData)
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
            eventType: true,
        }
    })
    return z.array(EventFromBDBriefSchema).parse(rawData);
}

export const detailedPublishedEventDataGET = async (slug: string) => {
    const res = await prisma.events.findFirst({
        where: {
            eventSlug: { equals: slug, mode: "insensitive" },
            publish: true
        },
    })
    return EventFromDBSchema.parse(res);
}

export const detailedAllEventDataGET = async (slug: string) => {
    try {
        const res = await prisma.events.findFirst({
            where: {
                eventSlug: { equals: slug, mode: "insensitive" },
            },
        })
        return { data: EventFromDBSchema.parse(res), success: true };
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
        return { data: EventFromDBSchema.parse(res), success: true };
    } catch (e) {
        console.log("Error during admin event detail by ID GET : ", e);
        return { success: false, error: 'No Event Data found' }
    }
}



export const checkEventTxSlugExists = async (tx: PrismaClientOrTx, slug: string) => {
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

export const addingEventToDbPOST = async (eventData: EventType & { publish: boolean }): Promise<string> => {
    return await prisma.$transaction(async (tx) => {
        const fileUploadMeta = await imagekit.upload({
            file: Buffer.from(await eventData.eventPoster!.arrayBuffer()),
            fileName: eventData.title + ".png",
            isPublished: true,
        })
        const fileUploadParsedMeta = FileMetaSchema.parse(fileUploadMeta);
        const eventSlug = await validateEventSlugGET(tx, eventData.title);
        const eventDbData = EventForDBSchema.parse({ ...eventData, bannerLink: fileUploadParsedMeta, eventSlug: eventSlug })
        await tx.events.create({
            data: eventDbData
        })

        return eventSlug;

    })

}

type EventForDBUpdateType = z.infer<typeof EventForDBUpdateInputSchema>


export const updatingEventToDbPATCH = async (eventData: EventForDBUpdateType, eventID: string): Promise<string> => {
    return await prisma.$transaction(async (tx) => {
        let fileUploadParsedMeta: ImageUploadReturnType | null = null;
        if (eventData.eventPoster) {
            const fileUploadMeta = await imagekit.upload({
                file: Buffer.from(await eventData.eventPoster!.arrayBuffer()),
                fileName: eventData.title + ".png",
                isPublished: true,
            })
            fileUploadParsedMeta = FileMetaSchema.parse(fileUploadMeta);
        }
        const eventDbData = EventForDBUpdateSchema.parse(eventData)
        const res = await tx.events.update({
            where: {
                eventID
            },
            data: {
                eventDbData
            }, select : {
                eventSlug : true
            }
        })
        return res.eventSlug
    })

}