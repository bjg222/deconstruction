class Item {
    constructor(type, value) {
        if (type === undefined)
            throw 'Item needs a type';
        this._ = {};
        this._.type = type;
        this._.value = (value ? parseInt(value, 10) : undefined);
    }

    updateObjectClasses() {
        this._.classes = undefined;
        if (this._.obj)
            this._.obj.removeClass().addClass(this.classes);
        return this;
    }

    assignGridArea(supply, item) {
        supply = this.parseGridAreaSize(supply);
        item = this.parseGridAreaSize(supply);
        let r = util.randInt(supply[0] - object[0]);
        let c = util.randInt(supply[1] - object[1]);
        this.$.css('grid-area', r + ' / ' + c + ' / ' + (r+item[0]) + ' / ' + (c+item[1]));
        return this;
    }

    appendTo(obj) {
        (obj instanceof $ ? obj : $(obj)).append(this.$);
        return this;
    }

    parseGridAreaSize(size) {
        if (size.length = 1)
            return [size, size];
        return size.slice(0,2);
    }

    get type() {
        return this._.type;
    }

    get value() {
        return this._.value;
    }

    get classes() {
        if (!this._.classes) {
            this._.classes = ['object', 'draggable', this.type];
            if (this.value)
                this._.classes.push('value-' + this.value);
        }
        return this._.classes.join(' ');
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        if (this.value)
            this._.obj = util.makeDraggableTextDiv(this.classes, undefined, this.value);
        else
            this._.obj = util.makeDraggableDiv(this.classes);
        this._.obj.on('dragstart', ev => this.onDragStart(ev));
        this._.obj.on('dragend', ev => this.onDragEnd(ev));
        this._.obj.on('drag', ev => this.onDrag(ev));
        return this._.obj;
    }

    onDragStart(ev) {
        this.$.addClass('dragging');
        this.$.parent().addClass('dragging-from');
        $('body').addClass('dragging-' + this.type);
        $('.' + this.type + 's .' + this.type + '-space').data('counter', 0);
    }

    onDragEnd(ev) {
        $('.dragging').removeClass('dragging');
        $('.dragging-from').removeClass('dragging-from');
        $('.dragging-over').removeClass('dragging-over');
        $('body').removeClass('dragging-' + this.type);
        $('.' + this.type + 's .' + this.type + '-space').data('counter', 0);
    }

    onDrag(ev) {
        ev.preventDefault();
    }

}

class Tile extends Item {
    constructor(category, bolts, circuits) {
        super('tile');
        this._.category = category;
        this._.bolts = bolts;
        this._.circuits = circuits;
        this._.face = 'down';
    }

    flip() {
        this._.face = (this._.face === 'down' ? 'up' : 'down');
        this.updateObjectClasses();
        return this;
    }

    get face() {
        return this._.face;
    }

    get bolts() {
        return this._.bolts;
    }

    get circuits() {
        return this._.circuits;
    }

    get category() {
        return this._.category;
    }

    get classes() {
        if (!this._.classes) {
            super.classes;
            this._.classes.push('category-' + this.category);
            this._.classes.push('face-' + this.face);
        }
        return this._.classes.join(' ');
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$
        this._.obj.append(util.makeTextDiv('bolts', undefined, this.bolts));
        this._.obj.append(util.makeTextDiv('circuits', undefined, this.circuits));
        this._.obj.append(util.makeTextDiv('category', undefined, this.category));
        return this._.obj;
    }
}

class Cube extends Item {
    constructor(type, value) {
        super(type, value);
    }
}

class Material extends Cube {
    constructor(value) {
        super('material', value)
    }
}

class Widget extends Cube {
    constructor(value) {
        super('widget', value)
    }
}

class Coin extends Item {
    constructor(value) {
        super('coin', value);
    }
}

class Worker extends Item {
    constructor(player) {
        super('worker')
        this._.player = (player ? parseInt(player, 10) : undefined);
    }

    set player(player) {
        this._.player = (player ? parseInt(player, 10) : undefined);
        this.updateObjectClasses();
    }

    get player() {
        return this._.player;
    }

    get classes() {
        if (!this._.classes) {
            super.classes;
            if (this.player)
                this._.classes.push('player-' + this.player);
        }
        return this._.classes.join(' ');
    }
}