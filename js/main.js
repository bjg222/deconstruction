
$(document).ready(function() {
    $('body').append(makeTable());
    addTileSupply();
    addMaterialSupply();
    addWidgetSupply();
    addCoinSupply();
    addWorkerSupply();
    addCommunity();
    $('body').append($('<button></button>').attr('id', 'add-player').text('+').on('click', addPlayer))
})