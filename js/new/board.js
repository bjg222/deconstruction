class Board extends JQDiv {
    constructor(extraClasses) {
        super(['board', extraClasses]);
    }
}

class PlayerBoard extends WithPlayer(Board) {
    constructor(player) {
        super('player');
        this.player = player;
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