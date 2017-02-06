type Header = { name: string };

export function h(tag: string = 'div', props: any = {}, children: Array<{}> | string = []) {
    return {
        tag,
        props,
        children
    };
}

export function isArrayEmpty(arr: any[]) {
    return arr.length === 0;
}

export function compareHeaders(headerA: Header, headerB: Header) {
    const aName = headerA.name || '';
    const bName = headerB.name || '';

    return aName.localeCompare(bName);
}
