import { SimpleAvailabilityCheckerConfig } from "../models";
import * as path from "path";
import * as fs from "fs-extra";

export function loadOptionsFromProfile(
    profileName: string,
    overrides: Partial<SimpleAvailabilityCheckerConfig>
): SimpleAvailabilityCheckerConfig {
    const path = getProfilePath(profileName);
    const data = JSON.parse(fs.readFileSync(path).toString());
    return { ...data, ...overrides };
}

export function getProfilePath(profileName: string): string {
    const basePath =
        process.env.APPDATA ||
        (process.platform == "darwin"
            ? process.env.HOME + "/Library/Preferences"
            : process.env.HOME + "/.local/share");
    return path.join(
        path.normalize(basePath),
        "simple-availability-checker",
        "profiles",
        `${profileName}.json`
    );
}

export function saveProfile(
    profileName: string,
    options: SimpleAvailabilityCheckerConfig
) {
    const fullPath = getProfilePath(profileName);
    fs.ensureDirSync(path.dirname(fullPath));
    fs.writeFileSync(fullPath, JSON.stringify(options));
    console.log(`Saved profile ${profileName} to ${fullPath}`);
}
