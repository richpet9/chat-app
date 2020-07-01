const Filter = require("bad-words");
const filter = new Filter();

export function cleanWords(string) {
    return filter.clean(string);
}

export function isProfane(string) {
    return filter.isProfane(string);
}
