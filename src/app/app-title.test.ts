import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("application title", () => {
  it("uses the approved LBH protocol name in the browser and visible shell", () => {
    const layout = readFileSync(join(process.cwd(), "src/app/layout.tsx"), "utf8");
    const header = readFileSync(join(process.cwd(), "src/components/header.tsx"), "utf8");
    const shell = readFileSync(join(process.cwd(), "src/components/app-shell.tsx"), "utf8");
    expect(layout).toContain('title: "LBH protocol"');
    expect(header).toContain("LBH protocol");
    expect(shell).toContain("LBH protocol");
    expect(layout).not.toContain("LBH Protocols Beta");
    expect(header).not.toContain("LBH Protocols Beta");
    expect(shell).not.toContain("LBH Protocols Beta");
  });
});
