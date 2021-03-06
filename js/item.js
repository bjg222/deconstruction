class Item extends WithType(WithValue(JQDiv)) {
    constructor(type, value, extraClasses) {
        super(type, ['item', 'draggable', extraClasses]);
        this._.maker = util.makeDraggableDiv;
        this.value = value;
    }

    assignGridArea(parentGridSize) {
        if (!this._.gridSize)
            this._.gridSize = util.getSizeOf(this.$);
        return super.assignGridArea(parentGridSize.slice(0,2), this._.gridSize.map((e,i) => Math.ceil(e / parentGridSize[i+2])));
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
        $('.supply, .space').each(function() { $(this).data('obj').counter = 0; });
    }

    onDragEnd(ev) {
        $('.dragging').removeClass('dragging');
        $('.dragging-from').removeClass('dragging-from');
        $('.dragging-over').removeClass('dragging-over');
        $('body').removeClass('dragging-' + this.type);
        $('.supply, .space').each(function() { $(this).data('obj').counter = 0; });
    }

    onDrag(ev) {
        ev.preventDefault();
    }

}

class Tile extends Item {
    constructor(category, bolts, circuits, price, production) {
        category = category[0].toLowerCase();
        super('tile', undefined, ['category-' + category, 'face-down', 'clickable']);
        this._.category = category;
        this._.bolts = bolts;
        this._.circuits = circuits;
        this._.price = price;
        this._.production = production;
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

    get price() {
        return this._.price;
    }

    get production() {
        return this._.production;
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
        this._.obj.append(util.makeTextDiv('price', undefined, this.price));
        this._.obj.append(util.makeTextDiv('production', undefined, this.production));
        this._.obj.on('dblclick', ev => this.flip());
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

class Indicator extends WithPlayer(Cube) {
    constructor(player) {
        super('indicator', undefined);
        this.player = player;
    }
}

class FirstPlayer extends Cube {
    constructor() {
        super('firstplayer', undefined)
    }
}

class Coin extends Item {
    constructor(value) {
        super('coin', value);
    }
}

class Worker extends WithPlayer(Item) {
    constructor(player) {
        super('worker', undefined, 'clickable');
        this.player = player;
    }

    train() {
        this._.classes.add('trained');
        this.refreshClasses();
        return this;
    }

    assignGridArea() {
        throw 'Not implemented';
    }

    set player(v) {
        let p = this.player
        super.player = v;
        if (this.player !== p) {
            this._.classes.rem('trained');
            this.refreshClasses();
        }
    }

    get player() {
        return super.player;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$
        this._.obj.on('dblclick', ev => this.train());
        return this._.obj;
    }
}