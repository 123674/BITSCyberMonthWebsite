import { describe, it, expect } from "vitest";
import { getEventStatus } from "./Poster";

describe("getEventStatus", () => {
    it('returns "upcoming" when startDate is in the future', () => {
        const start = new Date(Date.now() + 60_000);
        const end = new Date(Date.now() + 3_600_000);
        expect(getEventStatus(start, end)).toBe("upcoming");
    });

    it('returns "ongoing" when now is between start and end', () => {
        const start = new Date(Date.now() - 60_000);
        const end = new Date(Date.now() + 3_600_000);
        expect(getEventStatus(start, end)).toBe("ongoing");
    });

    it('returns "completed" when endDate is in the past', () => {
        const start = new Date(Date.now() - 3_600_000);
        const end = new Date(Date.now() - 60_000);
        expect(getEventStatus(start, end)).toBe("completed");
    });

    it('returns "completed" when startDate has passed and no endDate is given', () => {
        const start = new Date(Date.now() - 60_000);
        expect(getEventStatus(start)).toBe("completed");
    });
});
