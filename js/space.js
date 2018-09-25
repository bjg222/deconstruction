class Space extends WithType(WithPlayer(WithTextInDiv(WithCounter(JQDiv)))) {
    constructor(type, value, player, extraClasses) {
        super(type, ['space', 'droppable', extraClasses]);
        this.value = value;
        this.player = player;
    }

    appendItem(item) {
        return this.append(item.$);
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
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
        let $start = $('.dragging-from')
        if (this.$.hasClass('dragging-from') || !$item.hasClass(this.type) || this.$.find('.' + this.type).length > 0 || !this.processDrop($item, $start))
            return;
        this.$.children().hide();
        this.appendItem($item.css('grid-area', '').data('obj'));
        if ($start.hasClass('supply'))
            $start.data('obj').refreshTotal();
        if ($start.hasClass('space'))
            $start.children().show();
    }

    processDrop($item, $start) {
        return true;
    }
}

class Action extends WithPlayer(JQDiv) {
    constructor(title, workers, players, player, extraClasses) {
        super(['action', 'face-down', 'clickable', extraClasses]);
        this._.title = title;
        this._.workers = workers;
        this.player  = player;
        this._.face = 'down';
        this._.players = players;
    }

    flip() {
        this._.classes.rem('face-' + this._.face);
        this._.face = (this._.face === 'down' ? 'up' : 'down');
        this._.classes.add('face-' + this._.face);
        this.refreshClasses();
        return this;
    }

    get title() {
        return this._.title;
    }

    get workers() {
        return this._.workers;
    }

    get players() {
        return this._.players;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.append((new ActionWorkers(1, this.player, 'back')).$);
        this._.obj.append((new ActionTitle('Set Up', 'back')).$);
        this._.obj.append((new ActionWorkers(this.workers, this.player, 'front')).$);
        this._.obj.append((new ActionTitle(this.title, 'front')).$);
        if (this._.players)
            this._.obj.append(util.makeTextDiv('players', undefined, this._.players));
        this._.obj.on('dblclick', ev => this.flip());
        return this._.obj;
    }

}

class ActionWorkers extends JQDiv {
    constructor(workers, player, face) {
        super(['placement', face]);
        this._.workers = workers;
        this._.player = player;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        for (let idx of util.range(this._.workers))
            this._.obj.append((new WorkerSpace(idx+1, this._.player)).$);
        return this._.obj;
    }
}

class ActionTitle extends WithText(JQDiv) {
    constructor(title, face) {
        super(['title', face]);
        this.value = title;
    }
}

class WorkerSpace extends Space {
    constructor(number, player) {
        super('worker', number, player);
    }
}

class TileSpace extends Space {
    constructor(category, player) {
        super('tile', category, player);
    }
}