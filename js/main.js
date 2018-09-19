$(document).ready(function() {
    let table = new Table();
    let players = 0;
    table.prependTo('body');
    communityActions.forEach(a => table.community.actions.addAction(new Action(a[0], a[1]), a[2]));
    addSupplyItems(supplyStartsWith, table.community.supplies);
    $('#add-player').on('click', ev => {
        let p = new PlayerBoard(++players);
        playerActions.forEach(a => p.addAction(new Action(a[0], a[1]), a[2]));
        playerTileSpaces[util.randInt(playerTileSpaces.length-1)].forEach((a,i) => p.addTileSpace(new TileSpace(i+1, players), a));
        addSupplyItems(supplyStartsWithPerPlayer, table.community.supplies);
        addSupplyItems(playerStartsWith, p, players);
        table.players.addPlayer(p);
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
            return new Tile('ABC'[util.randInt(2)], util.randInt(1,4), util.randInt(1,4));
    }
}
