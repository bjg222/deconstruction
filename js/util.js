function range(n) {
    return [...Array(n).keys()];
}

function makeDiv(cls, id) {
    return make('div', cls, id);
}

function makeTextDiv(str, cls, id) {
    return makeDiv(cls, id).text(str);
}

function make(elem, cls, id) {
    return $('<' + elem + '></' + elem + '>').addClass(cls).attr('id',id);
}