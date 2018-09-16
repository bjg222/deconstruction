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

    // let parseGridSize = function(size) {
    //     if (!(size instanceof Array))
    //         return [size, size];
    //     return size.slice(0,2);
    // }

    let getSizeOf = function(obj) {
        if (!(obj instanceof $))
            obj = $(obj);
        return [parseFloat(obj.css('height')), parseFloat(obj.css('width'))];
    }

    let getGridSizeOf = function(obj) {
        if (!(obj instanceof $))
            obj = $(obj);
        if (obj.display().toLowerCase() !== 'grid')
            return undefined;
        let grid = obj.css('grid')
        let rows = grid.split('/')[0].trim().split(' ');
        let cols = grid.split('/')[1].trim().split(' ');
        rows = rows.lastIndexOf(rows[0]) + 1;
        cols = cols.lastIndexOf(cols[0]) + 1;
        return [rows, cols, parseFloat(rows[0]), parseFloat(cols[0])];
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
        // parseGridSize: parseGridSize,
        getSizeOf: getSizeOf,
        getGridSizeOf: getGridSizeOf
    };

}());

class JQDivClasses {
    constructor(...vals) {
        this.rep(vals);
    }

    _normalize(v, rec) {
        if (v === undefined || (typeof v === 'string' && !v.length))
            return [];
        if (typeof v === 'string')
            return v.split(' ');
        if (!(v instanceof Array))
            return v;
        v.forEach((o, i, a) => a[i] = this._normalize(o, true));
        return (rec ? v : v.flat(99));
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

    refreshId() {
        if (this._.obj)
            this._.obj.attr('id', this.id);
        return this;
    }

    prepend(obj) {
        this.$.prepend(obj instanceof $ ? obj : $(obj));
        return this;
    }

    prependTo(obj) {
        (obj instanceof $ ? obj : $(obj)).prepend(this.$);
        return this;
    }

    append(obj) {
        this.$.append(obj instanceof $ ? obj : $(obj));
        return this;
    }

    appendTo(obj) {
        (obj instanceof $ ? obj : $(obj)).append(this.$);
        return this;
    }

    assignGridArea(grid, div) {
        grid = util.parseGridSize(grid);
        div = util.parseGridSize(div);
        let r = util.randInt(grid[0] - div[0]);
        let c = util.randInt(grid[1] - div[1]);
        return this.setGridArea(r, c, div[0], div[1]);
    }

    setGridArea(r, c, h, w) {
        this.$.css('grid-area', r + ' / ' + c + ' / ' + (r+h) + ' / ' + (c+w));
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
        this._.obj.data('obj', this);
        return this._.obj;
    }
}

const WithPlayer = base => class extends (base) {
    constructor(...args) {
        super(...args);
        this._.player = undefined;
    }

    set player(v) {
        this._.classes.rem('player-' + this._.player);
        this._.player = (v ? parseInt(v, 10) : undefined);
        if (v)
            this._.classes.add('player-' + v);
        this.refreshClasses();
    }

    get player() {
        return this._.player;
    }
}

const WithCounter = base => class extends (base) {
    constructor(...args) {
        super(...args);
        this._.counter = 0;
    }

    set counter(v) {
        this._.counter = v;
    }

    get counter() {
        return this._.counter;
    }
}

const WithText = base => class extends (base) {
    constructor(...args) {
        super(...args);
        this._.value = undefined;
    }

    set value(v) {
        this._.value = v
    }

    get value() {
        return this._.value;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        if (this.value)
            this._.obj.append(this.value);
        return this._.obj;
    }
}

const WithValue = base => class extends (WithText(base)) {
    set value(v) {
        this._.classes.rem('value-' + this._.value);
        this._.value = (v ? parseInt(v, 10) : undefined);
        if (v)
            this._.classes.add('value-' + v);
        this.refreshClasses();
    }

    get value() {
        return this._.value;
    }
}

const WithChildDiv = base => class extends (base) {
    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.html(util.makeDiv().html(this._.obj.html()));
        return this._.obj;
    }
}

const WithTextInDiv = base => class extends (WithChildDiv(WithText(base))) {}

const WithValueInDiv = base => class extends (WithChildDiv(WithValue(base))) {}

const WithType = base => class extends (base) {
    constructor(type, ...args) {
        if (typeof type !== 'string')
            throw 'Type is needed';
        super(...args);
        this._.type = type.toLowerCase();
        this._.classes.add(type);
    }

    get type() {
        return this._.type;
    }
}