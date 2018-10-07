$(document).ready(function() {
    let table = new Table();
    let players = 0;
    let nextPlayer = 0;
    table.prependTo('body');
    actionList.basic.forEach(a => table.community.actions.addAction(new Action(a.title, a.workers).flip()));
    addSupplyItems(supplyStartsWith, table.community.supplies);
    $('#add-player').on('click', ev => {
        if (players == maxPlayers)
            return;
        let p = new PlayerBoard(++ nextPlayer);
        table.players.addPlayer(p);
        let c = 8;
        actionList.player.forEach(a => p.addAction(new Action(a.title, a.workers).flip(), [1, c++]));
        playerTileSpaces[util.randInt(playerTileSpaces.length-1)].forEach(s => p.addSpace(new TileSpace(s.category, players), [s.grid.row, s.grid.col]));
        addSupplyItems(playerStartsWith, p, nextPlayer);
        p.$.find('button').on('click', ev => {
            p.$.detach();
            players --;
            $('.table').data('obj').players.boards.splice($('.table').data('obj').players.boards.indexOf(p));
            $('#add-player').prop('disabled', false);
        })
        players ++;
        while (table.community.actions.actions.length > actionList.basic.length)
            table.community.actions.removeAction();
        util.shuffle(actionList.additional.slice(0,players).map((as, i) => as.map(a => new Action(a.title, a.workers, i+1))).flat()).slice(0,players*3).forEach(a => table.community.actions.addAction(a));
        addSupplyItems(supplyStartsWithPerPlayer, table.community.supplies);
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
        case 'firstplayer':
            return new FirstPlayer(player);
        case 'tile':
            let t = tileBag.splice(util.randInt(tileBag.length-1),1)[0];
            return new Tile(t.category, t.bolts, t.circuits, t.price, t.production);
    }
}

/*
TODO: Notes from first "playthrough" (2 players, both played by me) :
- Money is all off, there's no good ways to get more money during the game
√- Give tiles individual prices, make them sell for more
√- Increase the amount of money from the action space +5 Coins
√- Perhaps have some other action that also provides money
√- Make it cheaper to dispose of widgets at the game end ($3 seems like it's too high)
√- Totally forgot the "pay your workforce" part of the game...
- Action distribution between basic and advanced needs some tweaking
√- Early on, there were tons of actions, plenty of places to go
√- Got more crowded later, but in a way that seemed limiting
√- Maybe fewer basic actions, but more actions requiring set up
- Should selling tiles be an action?
√- Original idea was that it was an action, and took two turns.  That didn't seem right
√- If it is going to be an action, it should be a one turn action, and should allow selling any/all tiles, not just one
√- I kinda like it not being an action, though.  The other supplies can be bought/sold during the day, why not removed tiles?
√- I think the idea of it being an action was before I came up with the idea that once removed, they go in your supply, so I think it's ok to do away with it
- Material amounts seemed about right
- Produced widgets seemed about right
- Game does feel like it is a bit on the simplistic side
√- Look at other worker games and see what's interesting.  Don't want too much (Tzolkein is fun, but has way too much going on).
-- Maybe adding some randomness, in the way of event cards, would help?
- Definitely needs some indicators!
√- Turn counter
√- First player marker
√- Production rate

Other interesting ideas:
- Coop version, where there's one large factory in the middle that everybody's working together to break down
-- each player could be a different division with different abilities
- Cards that affect individuals or the table (akin to some of the attacking actions) (Monkey Wrench Cards!)
- partner version, where it's 2v2, each player with their own factory, but partners can work together
- First player each round could be "employee of the month"?
- Each turn has a different effect (could come from cards, or predefined)
*/