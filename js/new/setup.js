$(document).ready(function() {
    let table = new Table();
    let players = 0;
    table.appendTo('body');
    communityActions.forEach(a => table.community.actions.addAction(new Action(a[0], a[1]), a[2]));
    $('#add-player').on('click', ev => {
        let p = new PlayerBoard(++players);
        playerActions.forEach(a => p.addAction(new Action(a[0], a[1]), a[2]));
        playerBoardLayouts[util.randInt(playerBoardLayouts.length)].forEach((a,i) => p.addTileSpace(new TileSpace(i, players), a));
        //TODO: Add items to supplies
    }));
    $('#show-rules').on('click', ev => $('#rules').css('display', 'flex'));
    $('#hide-rules').on('click', ev => $('#rules').hide());
})
