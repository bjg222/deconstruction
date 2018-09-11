const util = (function() {

    let range = function(n) {
        return [...Array(n).keys()];
    }

    let randInt = function(l, u) {
        if (u === undefined) {
            u = l;
            l = 0;
        }
        return Math.floor(Math.random() * (u - l + 1) + l);
    }

    let make = function(elem, cls, id, str) {
        let obj = $('<' + elem + '>');
        if (cls)
            obj.addClass(cls);
        if (id)
            obj.attr('id', id);
        if (str)
            obj.text(str);
        return obj;
    };

    let makeDraggable = function(elem, cls, id, str) {
        return (make(elem, cls, id, str).attr('draggable', 'true'));
    }

    let makeDiv = function(cls, id) {
        return (make('div', cls, id));
    }

    let makeDraggableDiv = function(cls, id) {
        return (makeDraggable('div', cls, id));
    }

    let makeTextDiv = function(cls, id, str) {
        return (make('div', cls, id, str));
    }

    let makeDraggableTextDiv = function(cls, id, str) {
        return (makeDraggable('div', cls, id, str));
    }

    return {
        range: range,
        randInt: randInt,
        make: make,
        makeDraggable: makeDraggable,
        makeDiv: makeDiv,
        makeTextDiv: makeTextDiv,
        makeDraggableDiv: makeDraggableDiv,
        makeDraggableTextDiv: makeDraggableTextDiv
    };

}());