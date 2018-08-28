function makeTileSupply(n) {
    if (n === undefined)
        n = Math.floor(Math.random() * 51) + 50;
    $s = makeDroppable('supply tiles','tiles');
    $s.append(makeDiv('title').text('Tiles'));
    // fillSupply($s, 100, 40, n, makeTile);
    return $s;
}

function makeMaterialSupply(n) {
    if (n === undefined)
        n = Math.floor(Math.random() * 51) + 50;
    $s = makeDroppable('supply materials','materials');
    $s.append(makeDiv('title').text('Materials'));
    // fillSupply($s, 50, 10, n, makeMaterial);
    return $s;
}

function makeWidgetSupply(n) {
    if (n === undefined)
        n = Math.floor(Math.random() * 51) + 50;
    $s = makeDroppable('supply widgets','widgets');
    $s.append(makeDiv('title').text('Widgets'));
    // fillSupply($s, 50, 10, n, makeWidget);
    return $s;
}

function makeCoinSupply(n) {
    if (n === undefined)
        n = Math.floor(Math.random() * 51) + 50;
    $s = makeDroppable('supply coins','coins');
    $s.append(makeDiv('title').text('Coins'));
    var val = 0;
    // fillSupply($s, 75, 20, n, function() {
    //     switch (++val) {
    //         case 1: return makeCoin(1);
    //         case 2: return makeCoin(5);
    //         case 3: return makeCoin(10);
    //         case 4: val = 0; return makeCoin(25);
    //     }
    // });
    return $s;
}

function makeWorkerSupply(n) {
    if (n === undefined)
        n = Math.floor(Math.random() * 13) + 4;
    $s = makeDroppable('supply workers','workers');
    $s.append(makeDiv('title').text('Workers'));
    //fillSupply($s, 50, 10, n, makeWidget);
    // for (var idx of range(n))
    //     $s.append(makeWorker());
    return $s;
}

function makeDraggable(cls, id) {
    $d = makeDiv(cls, id).attr('draggable', 'true');
    $d.on('dragstart', onObjectDragStart);
    $d.on('dragend', onObjectDragEnd);
    $d.on('drag', onObjectDrag);
    $d.on('drop', onObjectDrop);
    return $d;
}

function makeDroppable(cls, id) {
    $d = makeDiv(cls, id);
    $d.on('dragenter', onObjectDragEnter);
    $d.on('dragover', onObjectDragOver);
    $d.on('dragleave', onObjectDragLeave);
    $d.on('drop', onObjectDrop);
    $d.data('counter', 0);
    return $d;
}

function makeTile(b, c) {
    $t = makeDraggable('tile');
    if (b === undefined)
        b = Math.ceil(Math.random() * 4);
    if (c === undefined)
        c = Math.ceil(Math.random() * 4);
    $t.append(makeDiv('bolts').text(b));
    $t.append(makeDiv('circuits').text(c));
    return $t;
}

function makeCube(cls) {
    return makeDraggable(cls);
}

function makeMaterial() {
    return makeCube('material');
}

function makeWidget() {
    return makeCube('widget');
}

function makeCoin(value) {
    return makeDraggable('coin').text(value);
}

function makeWorker(player) {
    return makeDraggable('worker' + (player !== undefined ? ' player-' + player : ''));
}

// function fillSupply($supply, supplySize, objectSize, number, makerFunction) {
//     for (var idx of range(number)) {
//         $t = makerFunction();
//         assignRandomGridArea($t, supplySize, objectSize);
//         $supply.append($t);
//     }
// }

function addToSupply($supply, type, maker, amount, player) {
    var n = amount;
    if (type == 'coin')
        n = Math.max(...Object.values(amount));
    if (n < 1)
        return;
    var $objs = [];
    var isPlayer = true;
    if ($supply.parents('#supply').length > 0)
        isPlayer = false;
    for (var idx in range(n)) {
        if (type == 'coin') {
            for (var val in amount) {
                if (amount[val] >= n - idx)
                    $objs.push(maker(val));
            }
        } else
            $objs.push(type == 'worker' && player !== undefined ? maker(player) : maker());
    }
    if (type != 'worker') {
        var ss, os;
        switch (type) {
            case 'coin':
                ss = (isPlayer ? [35,204] : 75);
                os = 20;
                break;
            case 'material':
            case 'widget':
                ss = (isPlayer ? [35, 98] : 50);
                os = 10;
                break;
            case 'tile':
                ss = (isPlayer ? undefined : 100);
                os = 40;
                break;
        }
        for (var $obj of $objs)
            assignRandomGridArea($obj, ss, os);
    }
    $supply.append($objs);
    if (isPlayer && (type == 'coin' || type == 'material' || type == 'widget'))
        updateSupplyValue($supply, type);
}

function assignRandomGridArea($obj, supplySize, objectSize) {
    var supplyRows, supplyCols, objectRows, objectCols;
    if (supplySize.length > 1) {
        supplyRows = supplySize[0];
        supplyCols = supplySize[1];
    } else {
        supplyRows = supplySize;
        supplyCols = supplySize;
    }
    if (objectSize.length > 1) {
        objectRows = objectSize[0];
        objectCols = objectSize[1];
    } else {
        objectRows = objectSize;
        objectCols = objectSize;
    }
    var row = Math.ceil(Math.random() * (supplyRows-objectRows+1));
    var col = Math.ceil(Math.random() * (supplyCols-objectCols+1));
    $obj.css('grid-area', row + ' / ' + col + ' / ' + (row+objectRows) + ' / ' + (col+objectCols));
}

function updateSupplyValue($supply, type, extra) {
    $contents = $supply.find('.' + type);
    var val = (extra ? extra : 0);
    if (type == 'coin') {
        $contents.each(function() { val += +$(this).text(); });
    } else
        val += $contents.length;
    $supply.find('.value').text(val);
}

function getType($obj) {
    if ($obj.hasClass('coin'))
        return 'coin';
    if ($obj.hasClass('widget'))
        return 'widget';
    if ($obj.hasClass('material'))
        return 'material';
    if ($obj.hasClass('tile'))
        return 'tile';
    if ($obj.hasClass('worker'))
        return 'worker';
}

function onObjectDragStart(e) {
    $(this).addClass('dragging');
    $(this).parent().addClass('dragging-from');
    var type = getType($(this));
    $('body').addClass('dragging-' + type);
    $('.' + type + 's .' + type + '-space').data('counter', 0);
}

function onObjectDragEnd(e) {
    $('.dragging').removeClass('dragging');
    $('.dragging-from').removeClass('dragging-from');
    $('.dragging-over').removeClass('dragging-over');
    var type = getType($(this));
    $('body').removeClass('dragging-' + type);
    $('.' + type + 's .' + type + '-space').data('counter', 0);
}

function onObjectDrag(e) {
    e.preventDefault();
}

function onObjectDragEnter(e) {
    e.preventDefault();
    // var type = getType($('.dragging'));
    // if (!$(this).hasClass(type + 's') && !$(this).hasClass(type + '-space'))
    //     return;
    $(this).data('counter', $(this).data('counter') + 1);
    $(this).addClass('dragging-over');
}

function onObjectDragOver(e) {
    e.preventDefault()
}

function onObjectDragLeave(e) {
    // var type = getType($('.dragging'));
    // if (!$(this).hasClass(type + 's') && !$(this).hasClass(type + '-space'))
    //     return;
    $(this).data('counter', $(this).data('counter') - 1);
    if ($(this).data('counter') < 1)
        $(this).removeClass('dragging-over');
}

function onObjectDrop(e) {
    e.preventDefault();
    var type = getType($('.dragging'));
    if ((!$(this).hasClass(type + 's') && !$(this).hasClass(type + '-space')) || $(this).hasClass('dragging-from'))
        return;
    switch (type) {
        case 'tile':
            if ($(this).hasClass('tile-space') && $(this).find('.tile').length > 0)
                return;
            if ($(this).hasClass('tile-space'))
                $(this).children().hide();
            if ($(this).hasClass('tiles'))
                assignRandomGridArea($('.dragging'), 100, 40);
            else
                $('.dragging').css('grid-area', '');
            if ($('.dragging-from').hasClass('tile-space'))
                $('.dragging-from').children().show();
            break;
        case 'coin':
            if ($(this).hasClass('supply-space')) {
                assignRandomGridArea($('.dragging'), [35,204], 20);
                updateSupplyValue($(this), 'coin', +($('.dragging').text()));
                // var val = 0;
                // $(this).find('.coin').each(function() { val += +$(this).text(); });
                // $(this).find('.value').text(val + (+($('.dragging').text())));
            }
            if ($(this).hasClass('supply'))
                assignRandomGridArea($('.dragging'), 75, 20);
            if ($('.dragging-from').hasClass('supply-space')) {
                updateSupplyValue($('.dragging-from'), 'coin', -($('.dragging').text()));
                // var val = 0;
                // $('.dragging-from').find('.coin').each(function() { val += +$(this).text(); });
                // $('.dragging-from').find('.value').text(val - (+($('.dragging').text())));
            }
            break;
        case 'material':
        case 'widget':
            if ($(this).hasClass('supply-space')) {
                assignRandomGridArea($('.dragging'), [35,98], 10);
                updateSupplyValue($(this), type, 1);
                // $(this).find('.value').text($(this).find('.'+type).length+1);
            }
            if ($(this).hasClass('supply'))
                assignRandomGridArea($('.dragging'), 50, 10);
            if ($('.dragging-from').hasClass('supply-space'))
                updateSupplyValue($('.dragging-from'), type, -1);
                // $('.dragging-from').find('.value').text($('.dragging-from').find('.'+type).length-1);
            break;
        case 'worker':
            if ($(this).hasClass('worker-space') && $(this).find('.worker').length > 0)
                return;
            if ($(this).hasClass('supply-space') && !($('.dragging').hasClass($(this).parent().attr('id')))) {
                $('.dragging').removeClass(function(idx, cls) { return (cls.match(/(^|\s)player-\S+/g) || []).join(' '); });
                $('.dragging').addClass($(this).parent().attr('id'));
            }
            if ($(this).hasClass('supply'))
                $('.dragging').removeClass(function(idx, cls) { return (cls.match(/(^|\s)player-\S+/g) || []).join(' '); });
            if ($(this).hasClass('worker-space'))
                $(this).children().hide();
            if ($('.dragging-from').hasClass('worker-space'))
                $('.dragging-from').children().show();
            break;
    }
    $('.dragging').appendTo(this);
    $(this).data('counter', 0);
}