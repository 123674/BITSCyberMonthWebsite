import { describe, it, expect } from "vitest";
import { EventSchemaDSPFTLocal, EventSchemaDSPF } from "./zodEventSchema";

const validLocalISO = "2026-10-10T10:30";

const baseEvent = {
    title: "Zero Day Summit",
    description: "A briefing on zero days",
    location: "Seminar Hall",
    mode: "Offline" as const,
    formLink: "https://forms.example.com/register",
    contactDetails: "society@example.com",
    paymentDetails: "Free",
    startDate: validLocalISO,
    endDate: "2026-10-10T12:30",
    eventPoster: null,
};

describe("EventSchemaDSPFTLocal", () => {
    it("accepts a valid event without a poster", () => {
        const result = EventSchemaDSPFTLocal.safeParse(baseEvent);
        expect(result.success).toBe(true);
    });

    it("rejects an invalid form link", () => {
        const result = EventSchemaDSPFTLocal.safeParse({ ...baseEvent, formLink: "not-a-url" });
        expect(result.success).toBe(false);
    });

    it("rejects an invalid mode", () => {
        const result = EventSchemaDSPFTLocal.safeParse({ ...baseEvent, mode: "Hybrid" });
        expect(result.success).toBe(false);
    });

    it("rejects malformed datetime strings", () => {
        const result = EventSchemaDSPFTLocal.safeParse({ ...baseEvent, startDate: "10/10/2026 10:30" });
        expect(result.success).toBe(false);
    });
});

describe("EventSchemaDSPF", () => {
    it("requires GMT-formatted ISO dates", () => {
        const result = EventSchemaDSPF.safeParse({
            ...baseEvent,
            startDate: "2026-10-10T10:30:00.000Z",
            endDate: "2026-10-10T12:30:00.000Z",
        });
        expect(result.success).toBe(true);
    });

    it("rejects local datetime format for GMT-required fields", () => {
        const result = EventSchemaDSPF.safeParse(baseEvent);
        expect(result.success).toBe(false);
    });
});
