
function makeTable() {
    $t = makeDiv('', 'table');
    $($t).append(makeSupply());
    $($t).append($('<hr>'));
    $($t).append(makeCommunity());
    $($t).append($('<hr>'));
    $($t).append(makePlayers());
    return $t;
}

function makeSupply() {
    return makeDiv('', 'supply');
}

function makeCommunity() {
    return makeDiv('', 'community');
}

function makePlayers() {
    return makeDiv('', 'players');
}

function addPlayer() {
    p = makePlayer();
    $('#players').append(p[0]);
}

function addCommunity() {
    $('#community').append(makeActionBoard());
}

function addTileSupply() {
    $('#supply').append(makeTileSupply());
    addToSupply($('#supply .tiles'), 'tile', makeTile, supplyStartsWith.tiles);
}

function addMaterialSupply() {
    $('#supply').append(makeMaterialSupply());
    addToSupply($('#supply .materials'), 'material', makeMaterial, supplyStartsWith.materials);
}

function addWidgetSupply() {
    $('#supply').append(makeWidgetSupply());
    addToSupply($('#supply .widgets'), 'widget', makeWidget, supplyStartsWith.widgets);
}

function addCoinSupply() {
    $('#supply').append(makeCoinSupply());
    addToSupply($('#supply .coins'), 'coin', makeCoin, supplyStartsWith.coins);
}

function addWorkerSupply() {
    $('#supply').append(makeWorkerSupply());
    addToSupply($('#supply .workers'), 'worker', makeWorker, supplyStartsWith.workers);
}

function makePlayer() {
    $b = makePlayerBoard(++players);
    addToSupply($b.find('.supply-space.workers'), 'worker', makeWorker, playerStartsWith.workers, players);
    addToSupply($b.find('.supply-space.materials'), 'material', makeMaterial, playerStartsWith.materials);
    addToSupply($b.find('.supply-space.widgets'), 'widget', makeWidget, playerStartsWith.widgets);
    addToSupply($b.find('.supply-space.coins'), 'coin', makeCoin, playerStartsWith.coins);
    addToSupply($('#supply .workers'), 'worker', makeWorker, supplyStartsWithPerPlayer.workers);
    addToSupply($('#supply .materials'), 'material', makeMaterial, supplyStartsWithPerPlayer.materials);
    addToSupply($('#supply .widgets'), 'widget', makeWidget, supplyStartsWithPerPlayer.widgets);
    addToSupply($('#supply .coins'), 'coin', makeCoin, supplyStartsWithPerPlayer.coins);
    addToSupply($('#supply .tiles'), 'tile', makeTile, supplyStartsWithPerPlayer.tiles);
    return $b;
}

function removePlayer(e) {
    $('.' + $(this).parent().attr('id')).parent().children().show();
    $('.' + $(this).parent().attr('id')).remove();
    $(this).parent().remove();
}

function showRules() {
    $('#rules').css('display', 'flex');
}

function hideRules() {
    $('#rules').hide();
}