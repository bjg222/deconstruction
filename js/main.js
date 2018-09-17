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
        addSupplyItems(playerStartsWith, p);
        table.players.addPlayer(p);
    });
    $('#show-rules').on('click', ev => $('#rules').css('display', 'flex'));
    $('#hide-rules').on('click', ev => $('#rules').hide());
})

function addSupplyItems(counts, board) {
    for (let item in counts) {
        let num = counts[item];
        let items = [];
        let makeItem = (val) => items.push(new ({worker: Worker, material: Material, widget: Widget, coin: Coin, tile: Tile}[item])(val));
        let makeItems = (qty, val) => util.range(qty).forEach(() => makeItem(val));
        if (num instanceof Object) {
            for (let val in num)
                makeItems(num[val], num);
        } else
            makeItems(num, 1);
        board[item].addItem(util.shuffle(items));
    }
}
