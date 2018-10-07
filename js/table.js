class Section extends JQDiv {
    constructor(name, extraClasses) {
        super([name, extraClasses]);
        this._.boards = [];
    }

    get boards() {
        return this._.boards;
    }

    addBoard(board) {
        if (board instanceof Array) {
            board.forEach(b => this.addBoard(b));
            return this;
        }
        this._.boards.push(board);
        return this.append(board.$);
    }
}

class Community extends Section {
    constructor() {
        super('community');
    }

    get supplies() {
        if (!this._.supplies)
            this._.supplies = new SupplyBoard();
        return this._.supplies
    }

    get actions() {
        if (!this._.actions)
            this._.actions = new ActionBoard();
        return this._.actions
    }

    get counters() {
        if (!this._.counters)
            this._.counters = new CounterBoard();
        return this._.counters
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addBoard(this.counters).addBoard(this.supplies).addBoard(this.actions);
        return this._.obj;
    }
}

class Players extends Section {
    constructor() {
        super('players');
    }

    addPlayer(...args) {
        return this.addBoard(...args);
    }

    get players() {
        return this.boards;
    }
}

class Table extends JQDiv {
    constructor(extraClasses) {
        super(['table', extraClasses]);
    }

    addSection(section) {
        if (section instanceof Array) {
            section.forEach(s => this.addSection(s));
            return this;
        }
        return this.append(section.$);
    }

    get community() {
        if (!this._.community)
            this._.community = new Community();
        return this._.community
    }

    get players() {
        if (!this._.players)
            this._.players = new Players();
        return this._.players
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this.addSection(this.community).append('<hr>').addSection(this.players);
        return this._.obj;
    }
}