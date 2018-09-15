class Board extends JQDiv {
    constructor(extraClasses) {
        super(['board', extraClasses]);
    }

    addChild(child, pos) {
        if (child instanceof Array) {
            child.forEach(c => this.addChild((c instanceof Array ? c[0] : c), (c instanceof Array ? c[1] : undefined)));
            return this;
        }
        if (pos)
            child.setGridArea(pos[0], pos[1], (pos.length > 2 ? pos[2] : 1), (pos.length > 3 ? pos[3] : 1));
        return this.append(child);
    }
}

class PlayerBoard extends WithTextInDiv(WithPlayer(Board)) {
    constructor(player) {
        super('player');
        this.player = player;
        this.value = player;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addChild(new MaterialSupply(this.player));
        this.addChild(new WidgetSupply(this.player));
        this.addChild(new CoinSupply(this.player));
        this.addChild(new WorkerSupply(this.player));
        return this._.obj;
    }
}

class SupplyBoard extends Board {
    constructor() {
        super('supply');
    }
}

class ActionBoard extends Board {
    constructor() {
        super('action');
    }
}