import z from "zod";

// Allowed Logo Format For Banners
export const allowedLogoFormat = new Set(['image/png', 'image/jpeg', 'image/webp']);

// Zod schema for eventPoster : FIle,startDate : ISO string
export const EventFromFormSchema = z.object({
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
        .refine((f) => !f || f.size < 1024 * 500, 'Logo must be less than 500kB')
        .refine((f) => !f || allowedLogoFormat.has(f.type), 'Logo must be a png, jpeg or webp'),
})


export const EventForDBUpdateSchema = z.object({
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
