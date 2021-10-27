export function removeKeysWhenValueUndefined(object: Object) {
    return Object.fromEntries(
        Object.entries(object).filter(([k, v]) => v !== undefined)
    );
}