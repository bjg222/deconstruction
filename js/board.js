class Board extends JQDiv {
    constructor(extraClasses) {
        super(['board', extraClasses]);
        this._.children = [];
    }

    get children() {
        return this._.children;
    }

    addChild(child, pos) {
        if (child instanceof Array) {
            child.forEach(c => this.addChild((c instanceof Array ? c[0] : c), (c instanceof Array ? c[1] : undefined)));
            return this;
        }
        if (pos)
            child.setGridArea(pos[0], pos[1], (pos.length > 2 ? pos[2] : 1), (pos.length > 3 ? pos[3] : 1));
        this._.children.push(child);
        return this.append(child.$);
    }
}

class PlayerBoard extends WithTextInDiv(WithPlayer(Board)) {
    constructor(player) {
        super('player');
        this.player = player;
        this.value = player;
    }

    addAction(...args) {
        return this.addChild(...args);
    }

    addTileSpace(...args) {
        return this.addChild(...args);
    }

    addSupply(...args) {
        return this.addChild(...args);
    }

    get supplies() {
        return this.children.filter(c => c instanceof Supply);
    }

    get actions() {
        return this.children.filter(c => c instanceof Action);
    }

    get tiles() {
        return this.children.filter(c => c instanceof TileSpace);
    }

    get materials() {
        if (!this._.materials)
            this._.materials = new MaterialSupply(this.player);
        return this._.materials
    }

    get widgets() {
        if (!this._.widgets)
            this._.widgets = new WidgetSupply(this.player);
        return this._.widgets
    }

    get coins() {
        if (!this._.coins)
            this._.coins = new CoinSupply(this.player);
        return this._.coins
    }

    get workers() {
        if (!this._.workers)
            this._.workers = new WorkerSupply(this.player);
        return this._.workers
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addSupply(this.materials);
        this.addSupply(this.widgets);
        this.addSupply(this.coins);
        this.addSupply(this.workers);
        return this._.obj;
    }
}

class SupplyBoard extends Board {
    constructor() {
        super('supply');
    }

    addSupply(...args) {
        return this.addChild(...args);
    }

    get supplies() {
        return this.children;
    }

    get tiles() {
        if (!this._.tiles)
            this._.tiles = new TileSupply();
        return this._.tiles
    }

    get materials() {
        if (!this._.materials)
            this._.materials = new MaterialSupply();
        return this._.materials
    }

    get widgets() {
        if (!this._.widgets)
            this._.widgets = new WidgetSupply();
        return this._.widgets
    }

    get coins() {
        if (!this._.coins)
            this._.coins = new CoinSupply();
        return this._.coins
    }

    get workers() {
        if (!this._.workers)
            this._.workers = new WorkerSupply();
        return this._.workers
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addSupply(this.tiles);
        this.addSupply(this.materials);
        this.addSupply(this.widgets);
        this.addSupply(this.coins);
        this.addSupply(this.workers);
        return this._.obj;
    }
}

class ActionBoard extends Board {
    constructor() {
        super('action');
    }

    get actions() {
        return this.children
    }

    addAction(...args) {
        return this.addChild(...args);
    }
}