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

    removeChild(pos) {
        if (typeof pos === 'string')
            pos = pos.split('/').map(s => s.trim());
        if (pos instanceof Array)
            pos = (pos[1]-1) * 2 + (pos[0]-1);
        if (pos === undefined)
            this._.children.pop().$.detach();
        else if (typeof pos === 'number')
            this._.children.splice(pos, 1)[0].$.detach();
        return this;
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

    addSpace(...args) {
        return this.addChild(...args);
    }

    addSupply(...args) {
        return this.addChild(...args);
    }

    addCounter(...args) {
        return this.addChild(...args);
    }

    get supplies() {
        return this.children.filter(c => c instanceof Supply);
    }

    get actions() {
        return this.children.filter(c => c instanceof Action);
    }

    get tilespaces() {
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

    get tiles() {
        if (!this._.tiles)
            this._.tiles = new TileSupply(this.player);
        return this._.tiles
    }

    get workers() {
        if (!this._.workers)
            this._.workers = new WorkerSupply(this.player);
        return this._.workers
    }

    get firstplayers() {
        if (!this._.firstplayers)
            this._.firstplayers = new FirstPlayerSpace();
        return this._.firstplayers
    }

    get consumption() {
        if (!this._.consumption)
            this._.consumption = new ConsumptionCounter(this.player);
        return this._.consumption
    }

    get production() {
        if (!this._.production)
            this._.production = new ProductionCounter(this.player);
        return this._.production
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.append($('<button>').addClass('remove').text('-'));
        this.addSupply(this.materials);
        this.addSupply(this.widgets);
        this.addSupply(this.coins);
        this.addSupply(this.tiles);
        this.addSupply(this.workers);
        this.addSpace(this.firstplayers);
        this.addCounter(this.consumption);
        this.addCounter(this.production);
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

    removeSupply(...args) {
        return this.removeChild(...args);
    }

    get supplies() {
        return this.children;
    }

    get tiles() {
        if (!this._.tiles)
            this._.tiles = new TileSupply();
        return this._.tiles;
    }

    get materials() {
        if (!this._.materials)
            this._.materials = new MaterialSupply();
        return this._.materials
    }

    get widgets() {
        if (!this._.widgets)
            this._.widgets = new WidgetSupply();
        return this._.widgets;
    }

    get coins() {
        if (!this._.coins)
            this._.coins = new CoinSupply();
        return this._.coins;
    }

    get workers() {
        if (!this._.workers)
            this._.workers = new WorkerSupply();
        return this._.workers;
    }

    get firstplayers() {
        if (!this._.firstplayers)
            this._.firstplayers = new FirstPlayerSupply();
        return this._.firstplayers;
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
        this.addSupply(this.firstplayers);
        return this._.obj;
    }
}

class ActionBoard extends Board {
    constructor() {
        super('action');
    }

    get actions() {
        return this.children;
    }

    addAction(...args) {
        return this.addChild(...args);
    }

    removeAction(...args) {
        return this.removeChild(...args);
    }
}

class CounterBoard extends Board {
    constructor() {
        super('counter');
    }

    addCounter(...args) {
        return this.addChild(...args);
    }

    removeCounter(...args) {
        return this.removeChild(...args);
    }

    get counters() {
        return this.children
    }

    get turn() {
        if (!this._.turn)
            this._.turn = new TurnCounter();
        return this._.turn
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addCounter(this.turn);
        return this._.obj;
    }

}

class Card extends Board {
    constructor(title, flavor, desc, action) {
        super('card');
        this._.title = title;
        this._.flavor = flavor;
        this._.desc = desc;
        if (action)
            this._.children.push(action);
    }

    get title() {
        return this._.title;
    }

    get flavor() {
        return this._.flavor;
    }

    get desc() {
        return this._.desc;
    }

    get action() {
        return this._.children[0];
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.append(util.makeTextDiv('title', undefined, this.title));
        this._.obj.append(util.makeTextDiv('flavor', undefined, this.flavor));
        this._.obj.append(this.action.$);
        this._.obj.append(util.makeTextDiv('desc', undefined, this.desc));
        return this._.obj;
    }
}
