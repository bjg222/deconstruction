function makeBoard(type) {
    var $b = makeDiv('board ' + type)
    return $b;
}

function makePlayerBoard(n) {
    var $b = makeBoard('player').attr('id', 'player-' + n);
    $b.append(makeTextDiv(n, 'label'));
    $b.append(make('button', 'remove').text('-').on('click', removePlayer));
    for (var idx in playerBoardActions)
        $b.append(makeActionSpace(n, idx, playerBoardActions[idx][2][0], playerBoardActions[idx][2][1], playerBoardActions[idx][0], playerBoardActions[idx][1]));
    for (var pos of playerBoardLayouts[Math.floor(Math.random()*playerBoardLayouts.length)])
        $b.append(makeTileSpace(n, pos[0], pos[1]));
    $b.append(makeSupplySpace(n, 'Materials', 'materials', 5, 1, 2));
    $b.append(makeSupplySpace(n, 'Widgets', 'widgets', 5, 9, 2));
    $b.append(makeSupplySpace(n, 'Coins', 'coins', 5, 4, 4));
    $b.append(makeSupplySpace(n, 'Workers', 'workers', 1, 4, 4));
    // for (var w in range(nWorkers))
    //     $ws.append(makeWorker(n));
    // $b.append($ws);
    return $b;
}

function makeActionBoard() {
    var $b = makeBoard('community actions').attr('id', 'actions');
    $b.append(makeDiv().css('grid-area', '1 / 1 / 2 / 2').append(makeTextDiv('A')));
    for (var idx in communityBoardActions)
        $b.append(makeActionSpace(0, idx, communityBoardActions[idx][2][0], communityBoardActions[idx][2][1], communityBoardActions[idx][0], communityBoardActions[idx][1]));
    return $b;
}

function makeActionSpace(player, action, row, col, title, workers) {
    var $as = makeDiv('action-space', 'action-space-' + player + '-' + action);
    $as.css('grid-area', row + ' / ' + col + ' / ' + (row+1) + ' / ' + (col+1));
    $as.append(makeActionPlacement(player, action, workers)).append(makeActionTitle(title));
    return $as;
}

function makeActionTitle(title) {
    return makeDiv('title').append(makeTextDiv(title));
}

function makeActionPlacement(player, action, workers) {
    var $p = makeDiv('placement');
    for (var worker of range(workers))
        $p.append(makeActionWorkerSpace(player, action, worker+1));
    return $p;
}

function makeActionWorkerSpace(player, action, worker) {
    var $ws = makeDroppable('worker-space', 'worker-space-' + player + '-' + action + '-' + worker)
    $ws.append(makeTextDiv(worker));
    return $ws;
}

function makeTileSpace(player, row, col) {
    var $ts = makeDroppable('tile-space', 'tile-space-' + player + '-' + row + '-' + col);
    $ts.css('grid-area', row + ' / ' + col + ' / ' + (row+1) + ' / ' + (col+1));
    $ts.append(makeTextDiv('(' + row + ', ' + col + ')'));
    return $ts;
}

function makeSupplySpace(player, title, type, row, col, width) {
    var $ss = makeDroppable('supply-space ' + type, 'supply-space-' + player + '-' + type);
    $ss.css('grid-area', row + ' / ' + col + ' / ' + (row+1) + ' / ' + (col+width));
    $ss.append(makeDiv('title').append(makeTextDiv(title)));
    $ss.append(makeDiv('value').text(0));
    return $ss;
}