import { describe, expect, it } from "vitest";
import { EventFromFormSchema } from "./events.schema";

// Mock File
function makeFile({ bytes = 1024 * 50, type = "image/png", name = "a.png" } = {}) {
    return new File([new Uint8Array(bytes)], name, { type });
}

describe("EventFromFormSchema", () => {

    const validTestDataForSchema = () => ({
        title: "Title",
        description: "Description",
        location: "idk",
        mode: "Offline",
        eventType: "Completed",
        formLink: "https://www.google.com",
        contactDetails: "For further queries, contact:\nHarshal - xxxxxxxxxx\nSonika - xxxxxxxxx",
        paymentDetails: "Registration Fee\nIEEE Members:  ₹250\nNon-IEEE Members:  ₹360",
        startDate: "2026-10-01T09:00:00.000Z",
        eventPoster: makeFile()
    })

    const validDataTypeValues = [
        ["null", null],
        ["undefined", undefined],
        ["number", 123],
        ["boolean", true],
        ["array", ["a"]],
        ["object", { a: 1 }],
        ["string","title"]
    ]

    const notStringFields = ["eventPoster"];

    describe("Data")

    it("Add Event Test", () => {
        expect(EventFromFormSchema.safeParse({ ...validTestDataForSchema() }).success).toBe(true)
    });

    it("Add Event Invalid Title Test", () => {
        expect(EventFromFormSchema.safeParse({ ...validTestDataForSchema(), title: 1234 }).success).toBe(false)
    });

    it("Add Event Invalid Title : Boolean Test", () => {
        const alteredTestData = { ...validTestDataForSchema, title: true }
        expect(EventFromFormSchema.safeParse({ ...validTestDataForSchema(), title: true }).success).toBe(false)
    });

})