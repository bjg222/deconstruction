class Item extends JQDiv {
    constructor(type, value, gridSize, extraClasses) {
        if (type === undefined)
            throw 'Item needs a type';
        value = (value ? parseInt(value, 10) : undefined);
        gridSize = util.parseGridSize(gridSize);
        super(['item', 'draggable', type, (value ? 'value-' + value : []), (extraClasses ? extraClasses : [])]);
        this._.type = type;
        this._.value = value;
        this._.gridSize = gridSize
        this._.maker = util.makeDraggableDiv;
    }

    appendToGrid(obj, size) {
        util.assignGridArea(this.$, size, this._.gridSize);
        this.appendTo(obj);
        return this;
    }

    appendTo(obj) {
        (obj instanceof $ ? obj : $(obj)).append(this.$);
        return this;
    }

    get type() {
        return this._.type;
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

class Worker extends Item {
    constructor(player) {
        player = (player ? parseInt(player, 10) : undefined);
        super('worker', undefined, (player ? 'player-' + player : undefined));
        this._.player = player;
    }

    set player(player) {
        this._.classes.rem('player-' + this._.player);
        this._.player = (player ? parseInt(player, 10) : undefined);
        if (player)
            this._.classes.add('player-' + this._.player);
        this.refreshClasses();
    }

    get player() {
        return this._.player;
    }
}