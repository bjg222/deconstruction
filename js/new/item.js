class Item extends WithType(WithValue(JQDiv)) {
    constructor(type, value, gridSize, extraClasses) {
        gridSize = util.parseGridSize(gridSize);
        super(type, ['item', 'draggable', extraClasses]);
        this._.gridSize = gridSize
        this._.maker = util.makeDraggableDiv;
        this.value = value;
    }

    assignGridArea(div) {
        return super.assignGridArea(div, this._.gridSize);
    }

    get type() {
        return this._.type;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.on('dragstart', ev => this.onDragStart(ev));
        this._.obj.on('dragend', ev => this.onDragEnd(ev));
        this._.obj.on('drag', ev => this.onDrag(ev));
        return this._.obj;
    }

    onDragStart(ev) {
        this.$.addClass('dragging');
        this.$.parent().addClass('dragging-from');
        $('body').addClass('dragging-' + this.type);
        $('.supply').each(function() { $(this).data('object').counter = 0; });
    }

    onDragEnd(ev) {
        $('.dragging').removeClass('dragging');
        $('.dragging-from').removeClass('dragging-from');
        $('.dragging-over').removeClass('dragging-over');
        $('body').removeClass('dragging-' + this.type);
        $('.supply').each(function() { $(this).data('object').counter = 0; });
    }

    onDrag(ev) {
        ev.preventDefault();
    }

}

class Tile extends Item {
    constructor(category, bolts, circuits) {
        category = category[0].toLowerCase();
        super('tile', undefined, 40, ['category-' + category, 'face-down']);
        this._.category = category;
        this._.bolts = bolts;
        this._.circuits = circuits;
        this._.face = 'down';
    }

    flip() {
        this._.classes.rem('face-' + this._.face);
        this._.face = (this._.face === 'down' ? 'up' : 'down');
        this._.classes.add('face-' + this._.face);
        this.refreshClasses();
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
        super(type, value, 10);
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
        super('coin', value, 20);
    }
}

class Worker extends WithPlayer(Item) {
    constructor(player) {
        super('worker', undefined);
        this.player = player;
    }
}