$(document).ready(function() {
    let table = new Table();
    let players = 0;
    table.prependTo('body');
    communityActions.forEach(a => table.community.actions.addAction(new Action(a[0], a[1]), a[2]));
    $('#add-player').on('click', ev => {
        let p = new PlayerBoard(++players);
        playerActions.forEach(a => p.addAction(new Action(a[0], a[1]), a[2]));
        playerTileSpaces[util.randInt(playerTileSpaces.length)].forEach((a,i) => p.addTileSpace(new TileSpace(i+1, players), a));
        //TODO: Add items to supplies
        table.players.addPlayer(p);
    });
    $('#show-rules').on('click', ev => $('#rules').css('display', 'flex'));
    $('#hide-rules').on('click', ev => $('#rules').hide());
})
