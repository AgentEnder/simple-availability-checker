export async function setAsyncInterval(
    callback: () => Promise<void>,
    interval: number
) {
    await callback();
    setTimeout(() => setAsyncInterval(callback, interval), interval);
}
