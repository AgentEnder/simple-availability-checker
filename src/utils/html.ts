import fetch from "node-fetch";
import { JSDOM } from "jsdom";

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