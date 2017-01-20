function h(tag = 'div', props = {}, children = []) {
    return {
        tag,
        props,
        children
    };
}

function isArrayEmpty(arr) {
    return arr.length === 0;
}

function compareHeaders(headerA, headerB) {
    const aName = headerA.name || '';
    const bName = headerB.name || '';

    return aName.localeCompare(bName);
}

module.exports = {
    h,
    isArrayEmpty,
    compareHeaders
};
