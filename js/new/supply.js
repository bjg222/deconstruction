class Supply extends WithType(WithPlayer(WithCounter(JQDiv))) {
    constructor(type, player, extraClasses) {
        super(type, ['supply', 'droppable', extraClasses])
        this.player = player;
    }

    appendItem(item) {
        if (!this._.gridSize)
            this._.gridSize = util.getGridSizeOf(this.$);
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
        let $start = $('dragging-from')
        if (this.$.hasClass('dragging-from') || !$item.hasClass(this.type) || !this.processDrop($item))
            return;
        this.appendItem($item, $start);
        this.refreshTotal();
        $('.dragging-from').data('object').refreshTotal();
    }

    processDrop($item, $start) {
        return false;
    }
}

class TileSupply extends Supply {
    constructor(player) {
        super('tile', 100, player);
    }

    processDrop($item, $start) {
        if ($start.hasClass('tile-space'))
            $start.children().show();
    }
}

class CubeSupply extends Supply {
    constructor(type, player) {
        super(type, player);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item, $start) {
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
        super('coin', player);
    }

    calcTotal() {
        return this.$.children().not('.title, .total').map(function() { return parseInt($(this).text()); }).get().reduce((s,v) => (s + v));
    }

    processDrop($item, $start) {
        return true;
    }
}

class WorkerSupply extends Supply {
    constructor(player) {
        super('worker', player);
    }

    appendItem(item) {
        return this.append(item.$).refreshTotal()
    }

    processDrop($item, $start) {
        $item.data('object').player(this.$.parent().hasClass('player') ? this.$.parent().attr('id') : undefined);
        if ($start.hasClass('worker-space'))
            $start.children().show();
    }
}