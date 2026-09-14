import { describe, expect, it } from "vitest";
import { lessonCardLines, packageCardLines } from "@/content/card-lines";
import { lessons, packages } from "@/content/packages";
import { toPublicPackage } from "@/content/cms/packages";

const [bronze, silver] = packages.map(toPublicPackage);
const TEST_DAY = "Pick-up and drop-off on road test day";

describe("packageCardLines", () => {
  it("builds the card from the structured fields", () => {
    expect(packageCardLines(bronze)).toEqual([
      "10 hours in-car instruction",
      "30 hours online coursework",
      "Pick-up and drop-off for every lesson",
      "MTO BDE certificate",
    ]);
  });

  it("lists road-test pick-up only when the package's toggle is on", () => {
    expect(packageCardLines(silver)).toContain(TEST_DAY);
    expect(packageCardLines(bronze)).not.toContain(TEST_DAY);
  });

  it("follows an hours change, including the singular", () => {
    expect(packageCardLines({ ...bronze, inCarHours: 11 })[0]).toBe("11 hours in-car instruction");
    expect(packageCardLines({ ...bronze, inCarHours: 1 })[0]).toBe("1 hour in-car instruction");
  });

  it("drops old typed lines that duplicate generated ones, but keeps the owner's own", () => {
    const lines = packageCardLines({
      ...bronze,
      highlights: ["10 hours in-car instruction", "MTO BDE certificate", "Free parallel parking refresher"],
    });
    expect(lines.filter((line) => line.includes("in-car instruction"))).toHaveLength(1);
    expect(lines.filter((line) => line.includes("certificate"))).toHaveLength(1);
    expect(lines).toContain("Free parallel parking refresher");
  });
});

describe("lessonCardLines", () => {
  it("leads with the lesson length and keeps its own inclusions", () => {
    expect(lessonCardLines(toPublicPackage(lessons[0]))).toEqual([
      "2 hours of in-car instruction",
      "Book as many as you need",
    ]);
  });
});
