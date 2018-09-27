const maxPlayers = 4;

let space = (t, r, c) => ({category: t, grid: {row: r, col: c}});

const playerTileSpaces = [
    //         1                2                3                4                5                6                7                8                9               10               11               12
    //     cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid        cat  grid
    [space('A', 3,2), space('A', 3,3), space('A', 3,4), space('B', 2,4), space('B', 4,4), space('B', 3,5), space('B', 3,6), space('B', 3,7), space('C', 2,7), space('C', 4,7), space('C', 3,8), space('C', 3,9)] ,
    [space('A', 3,3), space('A', 3,4), space('A', 2,4), space('B', 4,4), space('B', 2,5), space('B', 4,5), space('B', 2,6), space('B', 4,6), space('C', 2,7), space('C', 4,7), space('C', 3,7), space('C', 3,8)] ,
    [space('A', 3,2), space('A', 3,3), space('A', 4,3), space('B', 4,4), space('B', 4,5), space('B', 3,5), space('C', 2,5), space('B', 4,6), space('B', 4,7), space('C', 3,7), space('C', 3,8), space('C', 3,9)] ,
    [space('A', 3,2), space('A', 3,3), space('A', 2,3), space('B', 2,4), space('B', 2,5), space('B', 3,5), space('B', 4,5), space('B', 2,6), space('C', 4,6), space('C', 2,7), space('C', 4,7), space('C', 4,8)] ,
    [space('A', 3,3), space('A', 3,4), space('A', 2,4), space('B', 4,4), space('B', 2,5), space('B', 4,5), space('B', 2,6), space('C', 4,6), space('B', 3,6), space('C', 2,7), space('C', 4,7), space('C', 4,8)] ,
    [space('A', 3,3), space('A', 3,4), space('A', 2,4), space('B', 2,5), space('B', 2,6), space('B', 3,6), space('B', 4,6), space('C', 4,5), space('B', 4,7), space('C', 4,8), space('C', 3,8), space('C', 3,9)] ,
    [space('A', 2,3), space('A', 2,4), space('B', 3,4), space('B', 4,4), space('A', 2,5), space('C', 4,5), space('B', 2,6), space('B', 2,7), space('B', 3,7), space('C', 4,7), space('C', 2,8), space('C', 4,8)] ,
    [space('A', 4,2), space('A', 4,3), space('A', 3,3), space('B', 3,4), space('B', 2,4), space('B', 2,5), space('B', 2,6), space('B', 3,6), space('C', 4,6), space('C', 3,7), space('C', 3,8), space('C', 3,9)] ,
    [space('A', 3,2), space('A', 3,3), space('A', 2,3), space('B', 4,3), space('B', 2,4), space('B', 2,5), space('B', 3,5), space('C', 4,5), space('B', 2,6), space('C', 2,7), space('C', 2,8), space('C', 3,8)] ,
    [space('A', 3,2), space('A', 3,3), space('A', 3,4), space('B', 2,4), space('B', 4,4), space('B', 3,5), space('B', 3,6), space('B', 2,6), space('C', 2,7), space('C', 2,8), space('C', 3,8), space('C', 3,9)]
];

let action = (t, w, r, c) => ({title: t, workers: w, grid: {row: r, col: c}});
let actions = (a, n) => (new Array(n).fill(a));

const actionList = {
    //           title          workers
    //Actions on player boards
    player: [
        action('-1 B',          1),
        action('-1 C',          1),
        action('+5 Coins',      1)
    ].flat(),
    //Actions always present on community board
    basic: [
        action('-1 B',          1),
        action('-1 C',          1),
        action('Hire Worker',   3),
        action('Train Worker',  2),
        action('Repair Tile',   2),
        action('+10 Coins',     1),
    ].flat(),
    //Extra actions added to community board (choice of actions depends on number of players)
    additional: [
        //With 1+ players
        [
            action('-1 B',          2),
            action('-1 C',          2),
            action('-10 Widgets',   1),
            action('+10 Materials', 1),
        ].flat(),
        //With 2+ players
        [
            action('-2 B',          3),
            action('-2 C',          3),
        ].flat(),
        //With 3+ players
        [
            action('+2 Workers',    1),
            action('Scrap Tile',    3),
            action('-1 B',          1),
            action('-1 C',          1),
        ].flat(),
        //With 4 players
        [
            action('-10 Widgets',   2),
            action('+10 Materials', 2),
            action('+10 Coins',     2),
            action('Reduce Tile',   2),
        ].flat()
    ]
}

const playerActions = actionList.player;
const communityActions = actionList.basic;
const communityAdditionalActions = actionList.additional.flat();

let tile = (t, b, c, s, p) => ({category: t, bolts: b, circuits: c, price: s, production: p});
let tiles = (t, n) => (new Array(n).fill(t));

const tileList = {
    //             cat  B  C  +    #
    //Category A (hard)
    A: [
        tiles(tile('A', 2, 2, 15, 2),  2),
        tiles(tile('A', 2, 3, 18, 3),  2),
        tiles(tile('A', 3, 1, 16, 2),  2),
        tiles(tile('A', 3, 2, 16, 3),  2),
        tiles(tile('A', 3, 3, 18, 4),  2),
        tiles(tile('A', 4, 1, 17, 3),  3),
        tiles(tile('A', 4, 2, 20, 4),  2)
    ].flat(),
    //Category B (medium)
    B: [
        tiles(tile('B', 2, 1, 12, 1),  2),
        tiles(tile('B', 2, 1, 11, 1),  2),
        tiles(tile('B', 1, 2, 10, 1),  2),
        tiles(tile('B', 1, 2, 11, 1),  2),
        tiles(tile('B', 2, 2, 12, 2),  3),
        tiles(tile('B', 3, 1, 14, 2),  2),
        tiles(tile('B', 3, 1, 12, 1),  2),
        tiles(tile('B', 3, 1, 13, 1),  2),
        tiles(tile('B', 2, 1, 11, 2),  3),
        tiles(tile('B', 1, 2, 10, 2),  3),
        tiles(tile('B', 2, 2, 12, 1),  2)
    ].flat(),
    //Category C (easy)
    C: [
        tiles(tile('C', 1, 0, 3, 0),  3),
        tiles(tile('C', 1, 0, 4, 1),  3),
        tiles(tile('C', 1, 1, 6, 0),  2),
        tiles(tile('C', 1, 1, 7, 1),  3),
        tiles(tile('C', 1, 1, 8, 1),  3),
        tiles(tile('C', 2, 0, 7, 1),  4),
        tiles(tile('C', 2, 1, 9, 1),  2)
    ].flat()
};


const tileBag = [tileList.A, tileList.B, tileList.C].flat();

const playerStartsWith = {
    worker: 3,
    material: {1: 5, 5: 3, 10: 2},
    coin: {1: 5, 5: 2, 10: 2, 25: 1},
    widget: 0
};

const supplyStartsWith = {
    tile: tileBag.length,
    worker: 0,
    material: {1: 5, 5: 2, 10: 2},
    coin: {1: 10, 5: 4, 10: 3, 25: 2},
    widget: {1: 5, 5: 2, 10: 2}
};

const supplyStartsWithPerPlayer = {
    worker: 4,
    material: {1: 5, 5: 2, 10: 2},
    coin: {1: 10, 5: 2, 10: 2, 25: 2},
    widget: {1: 5, 5: 2, 10: 2}
};