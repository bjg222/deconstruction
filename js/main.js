
$(document).ready(function() {
    $('body').append(makeTable());
    addTileSupply();
    addMaterialSupply();
    addWidgetSupply();
    addCoinSupply();
    addWorkerSupply();
    addCommunity();
    $('body').append($('<button></button>').attr('id', 'add-player').text('+').on('click', addPlayer));
    $('body').append($('<button></button>').attr('id', 'show-rules').text('R').on('click', showRules));
    $('#hide-rules').on('click', hideRules);
})