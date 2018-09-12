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

    let assignGridArea = function($obj, grid, div) {
        grid = util.parseGridAreaSize(grid);
        div = util.parseGridAreaSize(grid);
        let r = util.randInt(grid[0] - div[0]);
        let c = util.randInt(grid[1] - div[1]);
        $obj.css('grid-area', r + ' / ' + c + ' / ' + (r+div[0]) + ' / ' + (c+div[1]));
    }

    let parseGridSize = function(size) {
        if (!(size instanceof Array))
            return [size, size];
        return size.slice(0,2);
    }

    return {
        range: range,
        randInt: randInt,
        make: make,
        makeDraggable: makeDraggable,
        makeDiv: makeDiv,
        makeTextDiv: makeTextDiv,
        makeDraggableDiv: makeDraggableDiv,
        makeDraggableTextDiv: makeDraggableTextDiv,
        assignGridArea: assignGridArea,
        parseGridSize: parseGridSize
    };

}());

class JQDivClasses {
    constructor(...vals) {
        this.rep(vals);
    }

    _normalize(v) {
        if (v === undefined)
            return [];
        if (typeof v === 'string')
            return v.split(' ');
        //!!!!!!!!
        v = [v];
        v.forEach((o, i, a) => (typeof o === 'string' && o.includes(' ') ? a[i] = o.split(' ') : 0));
        return v.flat(99);
    }

    set arr(v) {
        this.rep(v);
    }

    get arr() {
        return [...this._set];
    }

    set str(v) {
        this.rep(v);
    }

    get str() {
        return this.arr.join(' ');
    }

    add(v) {
        this._normalize(v).forEach(el => this._set.add(el));
    }

    rem(v) {
        this._normalize(v).forEach(el => this._set.delete(el));
    }

    clr() {
        this._set = new Set();
    }

    rep(v) {
        this._set = new Set(this._normalize(v));
    }
}

class JQDiv {
    constructor(classes, id) {
        this._ = {}
        this._.classes = new JQDivClasses(classes);
        this._.id = id;
        this._.maker = util.makeDiv;
    }

    refreshClasses() {
        if (this._.obj)
            this._.obj.removeClass().addClass(this.classes);
        return this;
    }

    get classes() {
        return this._.classes.str;
    }

    get id() {
        return this._.id;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        this._.obj = this._.maker(this.classes, this.id)
    }
}