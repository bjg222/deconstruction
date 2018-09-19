class Space extends WithType(WithPlayer(WithValueInDiv(WithCounter(JQDiv)))) {
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
    constructor(title, workers, player, extraClasses) {
        super(['action', extraClasses]);
        this._.title = title;
        this._.workers = workers;
        this.player  = player;
    }

    get title() {
        return this._.title;
    }

    get workers() {
        return this._.workers;
    }

    get $() {
        if (this._.obj)
            return this._.obj;
        super.$;
        this._.obj.append((new ActionWorkers(this.workers, this.player)).$);
        this._.obj.append((new ActionTitle(this.title)).$);
        return this._.obj;
    }

}

class ActionWorkers extends JQDiv {
    constructor(workers, player) {
        super('placement');
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
    constructor(title) {
        super('title');
        this.value = title;
    }
}

class WorkerSpace extends Space {
    constructor(number, player) {
        super('worker', number, player);
    }
}

class TileSpace extends Space {
    constructor(position, player) {
        super('tile', position, player);
    }
}