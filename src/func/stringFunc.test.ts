import { describe, it, expect } from "vitest";
import validate, { slugify } from "./stringFunc";

describe("slugify", () => {
    it("strips spaces and special characters", () => {
        expect(slugify("Capture The Flag 2026!")).toBe("CaptureTheFlag2026");
    });

    it("normalizes unicode characters", () => {
        expect(slugify("Crème Brûlée")).toBe("CremeBrulee");
    });

    it("returns an empty string for fully special input", () => {
        expect(slugify("!!! --- ***")).toBe("");
    });
});

describe("validate", () => {
    it("rejects non-strings", () => {
        // @ts-expect-error intentionally wrong type
        expect(validate(42).valid).toBe(false);
    });

    it("rejects strings over the length limit", () => {
        expect(validate("a".repeat(2001)).valid).toBe(false);
    });

    it("accepts a normal message and normalizes whitespace", () => {
        const result = validate("  hello    world  ");
        expect(result.valid).toBe(true);
        expect(result.value).toBe("hello world");
    });

    it("rejects profane content", () => {
        expect(validate("this is shit").valid).toBe(false);
    });

    it("strips invisible characters before validating", () => {
        const result = validate("he​llo​world");
        expect(result.valid).toBe(true);
        expect(result.value).toBe("helloworld");
    });
});
