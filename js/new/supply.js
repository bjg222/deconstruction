class Supply extends WithType(WithPlayer(WithCounter(JQDiv))) {
    constructor(type, gridSize, player, extraClasses) {
        gridSize = util.parseGridSize(gridSize);
        super(type, ['supply', 'droppable', extraClasses])
        this._.gridSize = gridSize;
        this.player = player;
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
        if (--this.counter < 1)
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
    constructor(player) {
        super('tile', 100, player);
    }

    processDrop($item) {
        if ($('.dragging-from').hasClass('tile-space'))
            $('.dragging-from').children().show();
    }
}

class CubeSupply extends Supply {
    constructor(type, player) {
        super(type, 50, player);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item) {
        return true;
    }
}

class MaterialSupply extends CubeSupply {
    constructor(player) {
        super('material', player);
    }
}

class WidgetSupply extends CubeSupply {
    constructor(player) {
        super('widget', player);
    }
}

class CoinSupply extends Supply {
    constructor(player) {
        super('coin', 75, player);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item) {
        return true;
    }
}

class WorkerSupply extends Supply {
    constructor(player) {
        super('worker', undefined, player);
    }

    processDrop($item) {
        $('.dragging').data('object').player(this.$.parent().hasClass('player') ? this.$.parent().attr('id') : undefined);
        if ($('.dragging-from').hasClass('worker-space'))
            $('.dragging-from').children().show();
    }
}