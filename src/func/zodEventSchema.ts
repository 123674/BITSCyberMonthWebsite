import z from "zod";

const allowedLogoFormat = new Set(['image/png', 'image/jpeg', 'image/webp']);

// DSPF -> Data String, Poster File

export const EventSchemaDSPF = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.string().refine((st) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(st), 'Invalid GMT Date Format'),
    endDate: z.string().refine((st) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d:[0-5]\d\.\d{3}Z$/.test(st), 'Invalid GMT Date Format'),
    eventPoster: z.instanceof(File).nullable()
        .refine((f) => !f || f.size > 1024, 'Logo must atleast 1kB')
        .refine((f) => !f || f.size < 1024 * 1000, 'Logo must be less than 1000 kB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
})

export const EventSchemaDSPFTLocal = z.object({
    title: z.string(),
    description: z.string(),
    location: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    formLink: z.url(),
    contactDetails: z.string(),
    paymentDetails: z.string(),
    startDate: z.string().refine((stDate) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/.test(stDate), 'Invalid Date Format'),
    endDate: z.string().refine((stDate) => /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,3})?)?$/.test(stDate), 'Invalid Date Format'),
    eventPoster: z.instanceof(File).nullable()
        .refine((f) => !f || f.size > 1024, 'Logo must atleast 1kB')
        .refine((f) => !f || f.size < 1024 * 1000, 'Logo must be less than 1000 kB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
})


export const EventSchemaForDBDSPF = EventSchemaDSPF.extend({publish : z.boolean()}).partial()

export type EventDSPFType = z.infer<typeof EventSchemaDSPF>
export type EventForDBUpdateDSPFType = z.infer<typeof EventSchemaForDBDSPF>

const VersionInfoSchema = z.object({
    id: z.string(),
    name: z.string(),
})

const AITagSchema = z.object({
    name: z.string(),
    confidence: z.number(),
    source: z.string(),
})

export const FileMetaSchema = z.object({
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

export type ImageUploadReturnType = z.infer<typeof FileMetaSchema>


export const EventSchemaDSPL = EventSchemaDSPF.omit({eventPoster : true}).extend({bannerLink : FileMetaSchema,publish : z.boolean(), eventSlug : z.string() })
export const EventSchemaDSPLWithoutSlug = EventSchemaDSPF.omit({eventPoster : true}).extend({bannerLink : FileMetaSchema,publish : z.boolean() })
export const EventSchemaDSPLWithoutSlugOptional = EventSchemaDSPF.omit({eventPoster : true}).extend({bannerLink : FileMetaSchema,publish : z.boolean() }).partial()
export const EventSchemaDDPLWithSlugWithID = EventSchemaDSPF.omit({eventPoster : true,startDate : true,endDate : true}).extend({bannerLink : FileMetaSchema,publish : z.boolean(),startDate : z.date(),eventSlug : z.string(),endDate : z.date(), eventID : z.string() })
export const EventSchemaDDPLWithoutlug = EventSchemaDSPF.omit({eventPoster : true,startDate : true,endDate : true}).extend({bannerLink : FileMetaSchema,publish : z.boolean(),startDate : z.date(),endDate : z.date() })

export type EventTypeDDPLWithoutlug = z.infer<typeof EventSchemaDDPLWithoutlug>



export const EventFromBDBriefSchema = z.array(z.object({
    title: z.string(),
    eventID: z.string(),
    mode: z.enum(['Offline', 'Online', 'Mixed']),
    startDate: z.date(),
    endDate: z.date(),
    bannerLink: FileMetaSchema,
    eventSlug: z.string(),
    description : z.string(),
    location : z.string()
}))

export type EventFromBDBriefBreif = z.infer<typeof EventFromBDBriefSchema>