import notifier from "node-notifier";
import open from "open";

import { SimpleAvailabilityCheckerConfig } from "../models";
import { setAsyncInterval, downloadHTML, checkElementExists } from "../utils";

export function getAvailableMessage(productName: string, date: string) {
    return `${productName} Available!
${date}`;
}

export function startChecker(options: SimpleAvailabilityCheckerConfig) {
    setAsyncInterval(async () => {
        const date = new Date().toLocaleString();
        console.log(`[${date}]: CHECKING AVAILABILITY`);
        const dom = await downloadHTML(options.url);
        if (!checkElementExists(dom, options.selector)) {
            notifier.notify(
                {
                    message: getAvailableMessage(
                        options.productName || options.url,
                        date
                    ),
                    timeout: 60000,
                    open: options.url, // For some reason this isn't working on windows 11
                    title: "Simple Availability Checker",
                    actions: ["Open Page"],
                },
                (err, resp, meta) => {
                    if (
                        (meta as any)?.action === "buttonClicked" &&
                        meta?.activationType === "Open Page"
                    ) {
                        open(options.url);
                    }
                }
            );
            console.log("Notification sent");
        }
    }, options.interval * 1000);
}
