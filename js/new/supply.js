class Supply extends JQDiv {
    constructor(type, gridSize, extraClasses) {
        if (type === undefined)
            throw 'Supply needs a type';
        gridSize = util.parseGridSize(gridSize);
        type = type.toLowerCase();
        super(['supply', 'droppable', type + 's', (extraClasses ? extraClasses : '')])
        this._.type = type;
        this._.gridSize = gridSize;
        this._.counter = 0;
    }

    appendItem(item) {
        return this.append(item.assignGridArea(this._.gridSize).$).refreshTotal()
    }

    refreshTotal() {
        this.$.find('.total').text(this.calcTotal());
        return this;
    }

    calcTotal() {
        return this.$.children().not('.title, .total').length;
    }

    get type() {
        return this._.type;
    }

    set counter(v) {
        this._.counter = v;
    }

    get counter() {
        return this._.counter;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.append(util.makeTextDiv('title', undefined, this.type + 's'));
        this._.obj.append(util.makeTextDiv('total', undefined, 0));
        this._.obj.on('dragenter', ev => this.onDragEnter(ev));
        this._.obj.on('dragover', ev => this.onDragOver(ev));
        this._.obj.on('dragleave', ev => this.onDragLeave(ev));
        this._.obj.on('drop', ev => this.onDrop(ev));
        return this._.obj;
    }

    onDragEnter(ev) {
        ev.preventDefault();
       this.counter++;
        this.$.addClass('dragging-over');
    }

    onDragOver(ev) {
        ev.preventDefault();
    }

    onDragLeave(ev) {
        if (--this._.counter < 1)
            this.$.removeClass('dragging-over');
    }

    onDrop(ev) {
        ev.preventDefault();
        let $item = $('.dragging');
        if (this.$.hasClass('dragging-from') || !$item.hasClass(this.type) || !this.processDrop($item))
            return;
        this.appendItem($item);
        this.refreshTotal();
        $('.dragging-from').data('object').refreshTotal();
    }

    processDrop($item) {
        return false;
    }
}

class TileSupply extends Supply {
    constructor() {
        super('tile', 100);
    }

    processDrop($item) {
        if ($('.dragging-from').hasClass('tile-space'))
            $('.dragging-from').children().show();
    }
}

class CubeSupply extends Supply {
    constructor(type) {
        super(type, 50);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item) {
        return true;
    }
}

class MaterialSupply extends CubeSupply {
    constructor() {
        super('material');
    }
}

class WidgetSupply extends CubeSupply {
    constructor() {
        super('widget');
    }
}

class CoinSupply extends Supply {
    constructor() {
        super('coin', 75);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item) {
        return true;
    }
}

class WorkerSupply extends Supply {
    constructor() {
        super('worker', undefined);
    }

    processDrop($item) {
        $('.dragging').data('object').player(this.$.parent().hasClass('player') ? this.$.parent().attr('id') : undefined);
        if ($('.dragging-from').hasClass('worker-space'))
            $('.dragging-from').children().show();
    }
}