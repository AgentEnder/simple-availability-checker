import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import notifier from "node-notifier";

export function downloadHTML(url: string): Promise<JSDOM> {
    return fetch(url)
        .then((x: any) => x.text())
        .then((html: any) => {
            return new JSDOM(html);
        });
}

export function checkElementExists(dom: JSDOM, selector: string): boolean {
    return !!dom.window.document.querySelector(selector);
}

export async function setAsyncInterval(
    callback: () => Promise<void>,
    interval: number
) {
    await callback();
    setTimeout(() => setAsyncInterval(callback, interval), interval);
}

const url = "https://store.nintendo.com/nintendo-64-controller.html";
// const url =
//     "https://store.nintendo.com/super-nintendo-entertainment-system-controller.html";

setAsyncInterval(async () => {
    console.log("CHECKING AVAILABILITY");
    const dom = await downloadHTML(url);
    if (!checkElementExists(dom, ".stock.unavailable")) {
        const n = notifier.notify(
            {
                message: "Nintendo 64 Controller Available!",
                wait: true,
                open: url,
                title: 'N64 Stock Checker'
            },
        );
        console.log("Notification sent");
    }
}, 30 * 1000);
