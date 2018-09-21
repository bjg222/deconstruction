$(document).ready(function() {
    let table = new Table();
    let players = 0;
    let nextPlayer = 0;
    table.prependTo('body');
    communityActions.forEach(a => table.community.actions.addAction(new Action(a.title, a.workers), [a.grid.row, a.grid.col]));
    addSupplyItems(supplyStartsWith, table.community.supplies);
    $('#add-player').on('click', ev => {
        if (players == maxPlayers)
            return;
        let p = new PlayerBoard(++ nextPlayer);
        playerActions.forEach(a => p.addAction(new Action(a.title, a.workers), [a.grid.row, a.grid.col]));
        playerTileSpaces[util.randInt(playerTileSpaces.length-1)].forEach((s,i) => p.addTileSpace(new TileSpace(i+1, players), [s.grid.row, s.grid.col]));
        p.$.find('button').on('click', ev => {
            p.$.detach();
            players --;
            $('.table').data('obj').players.boards.splice($('.table').data('obj').players.boards.indexOf(p));
            $('#add-player').prop('disabled', false);
        })
        table.players.addPlayer(p);
        players ++;
        addSupplyItems(supplyStartsWithPerPlayer, table.community.supplies);
        addSupplyItems(playerStartsWith, p, players);
        if (players == maxPlayers)
            $('#add-player').prop('disabled', true);
    });
    $('#show-rules').on('click', ev => $('#rules').css('display', 'flex'));
    $('#hide-rules').on('click', ev => $('#rules').hide());
})

function addSupplyItems(counts, board, player) {
    for (let item in counts) {
        let qty = counts[item];
        let items = [];
        let makeItems = (qty, val) => util.range(qty).forEach(() => items.push(makeItem(item, val, player)));
        if (qty instanceof Object) {
            for (let val in qty)
                makeItems(qty[val], val);
        } else
            makeItems(qty, 1);
            util.shuffle(items).forEach((it) => board[item+'s'].appendItem(it));
    }
}

function makeItem(type, value, player) {
    switch (type) {
        case 'material':
            return new Material(value);
        case 'widget':
            return new Widget(value);
        case 'coin':
            return new Coin(value);
        case 'worker':
            return new Worker(player);
        case 'tile':
            let t = tileBag.splice(util.randInt(tileBag.length-1),1)[0];
            return new Tile(t.category, t.bolts, t.circuits, t.production);
    }
}
