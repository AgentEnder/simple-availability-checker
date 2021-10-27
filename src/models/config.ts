export interface SimpleAvailabilityCheckerConfig {
    url: string;
    interval: number;
    selector: string;
    forceInterval: boolean;
    productName?: string;
}
