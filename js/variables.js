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
    //Actions always present on community board, starting face up
    basic: [
        action('-1 B',          1),
        action('-1 C',          1),
        action('Hire Worker',   3),
        action('+10 Coins',     1),
    ].flat(),
    //Actions always present on community board, starting face down
    advanced: [
        action('Train Worker',  2),
        action('Repair Tile',   2),
        action('Card',          2),
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
            action('2 Temp Workers',1),
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
/*
TODO: Some further action ideas (if I add cards, some of these might work there, too)
- First player next turn (Open early tomorrow)
- Don't pay worker(s) (Vacation)
- actions to attack other people's workers
-- hiring somebody else's employee
-- inciting a strike at their factory
-- corporate espionage
-- place on somebody else's private action
- disassemble machine (ie, A -> 2 B or B -> 2 C)
- Use an action in secret
- night shift (ie, get a second chance at actions)
- draw cards (if cards are added)
- R&D to reduce material usage or production value
- temporary shutdown - reduce production for a day
- trained workers ability alternatives
-- can use a blocked action
-- can kick out an untrained worker to use a space, returning that worker to its owner
-- double all item actions
-- do multi day actions faster
-- >1 kind of training, with different abilities
-- advanced training levels that add abilities
- actions that require trained workers
- actions that require multiple workers
- taxes - everybody has to pay extra or receive for items/workers
- protection - like taxes, but payed to one player
- violations/OSHA - people with messy factories/a lot of items/workers have to pay fines
- bribes of some kind - reduce taxes/costs
- some multi day actions have a min time & max time, you can choose to take longer to guarantee you'll get it next turn
*/

let card = (t, f, d, a) => ({title: t, flavor: f, desc: d, action: a});

const cardList = [
    //    title                      flavor                                          desc                                                                               action
    card('Lucrative Offer',         'A tempting signing bonus helps',                       'Take a worker from another player & pay $5 to the supply',                 action('Poach Worker', 2)),
    card('Vacation',                'Everybody needs a day off',                            'All players set one worker aside for this round, pay one less salary'),
    card('Doctor\'s Appointment',   'Employee health is our priority',                      'One of your employees is not moved at the end of this round'),
    card('Sabotage',                'Not just a Beastie Boys song',                         'The player to your right marks one of your machines as damaged'),
    card('Corporate Espionage',     'Guard your secrets carefully',                         'Choose an opponent and duplicate one of their actions this round',         action('Send Spy', 1)),
    card('Found Keycard',           'You\'re just testing their security',                  'use somebody else\'s private action'),
    card('Strike',                  'Collective bargaining at its finest',                  'all players can\'t remove equipment this turn'),
    card('Disassembly',             'What happens if I take this piece off?',               'break an A into 2 B or a B into 2 C',                                      action('Dissasemble', 1)),
    card('Night Shift',             'Who needs sleep?',                                     'place two workers at end of round, resolve actions right away',            action('Night Shift', 1)),
    card('Awards Banquet',          'Motivated employees are productive employees',         '+50% B & C earned this round'),
    card('Caffeine Boost',          'Coffee solves all problems',                           'One multi-day worker skips a space at the end of the round',               action('Coffee Run', 1)),
    card('Taxes',                   'One of the few inevitable things',                     'Everybody pay 10% of equipment value (round up)'),
    card('Protection',              'Just making sure nothing bad happens...',              'All other players pay you $2/worker',                                      action('Rough Up', 2)),
    card('Greased Palms',           'Help take these off my hands',                         '-10 widgets'),
    card('Fell of a Truck',         'Plausible deniability',                                '+10 materials'),
    card('OSHA inspection',         'Messy factories lead to accidents',                    'pay $5 fine if materials + widgets > 20'),
    card('Temporary Shutdown',      'We can trun this off just for a little while',         'Produce half of the normal widgets (round up)',                            action('Shutdown', 1)),
    card('World Cup',               'Distractions are everywh -- GOOOOOAAAALLLL',           'all players decrease B & C earned by 1'),
    card('Hire Consultant',         'Finding synergies for increased efficiency',           'pay $5, place 2 workers during your first placement next turn',            action('Hire Consultant', 1)),
    card('Antiques Collector',      'One man\'s trash...',                                  'All can sell widgets up to greater of 10  or 50% for double price'),
    card('Museum Donation',         'Preserved for posterity',                              'Remove one equipment, don\'t get money for it',                            action('Donate', 1)),
    card('Intern',                  'Free, but inexperienced, labor',                       'get an extra worker this round, only usable on B & C actions'),
    card('Accelerated Training',    'We\'ve optimized our courses for better retention',    'train a worker',                                                           action('Train Worker', 1)),
    card('Employee of the Month',   'Comes with a premium parking spot',                    'Take the first player marker',                                             action('First Player', 1))
];

let cardDrawPile = util.shuffle([...cardList]);
let cardDiscardPile = [];

const playerActions = actionList.player;
const communityActions = actionList.basic;
const communityAdditionalActions = actionList.additional.flat();

let tile = (t, b, c, s, p) => ({category: t, bolts: b, circuits: c, price: s, production: p});
let tiles = (t, n) => (new Array(n).fill(t));

const tileList = {
    //             cat  B  C   $  +    #
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
        tiles(tile('C', 1, 0,  3, 0),  3),
        tiles(tile('C', 1, 0,  4, 1),  3),
        tiles(tile('C', 1, 1,  6, 0),  2),
        tiles(tile('C', 1, 1,  7, 1),  3),
        tiles(tile('C', 1, 1,  8, 1),  3),
        tiles(tile('C', 2, 0,  7, 1),  4),
        tiles(tile('C', 2, 1,  9, 1),  2)
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
    widget: {1: 5, 5: 2, 10: 2},
    firstplayer: 1
};

const supplyStartsWithPerPlayer = {
    worker: 4,
    material: {1: 5, 5: 2, 10: 2},
    coin: {1: 10, 5: 2, 10: 2, 25: 2},
    widget: {1: 5, 5: 2, 10: 2}
};
