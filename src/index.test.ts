import Game, { GRID_SIZE } from '.';

test(`Create the Game with grid size '3x3'.`, () => {
    const size = GRID_SIZE['3x3'];
    const game = new Game(size);
    expect(game).toBeInstanceOf(Game);
});

test(`Create the Game with grid size '4x4'.`, () => {
    const size = GRID_SIZE['4x4'];
    const game = new Game(size);
    expect(game).toBeInstanceOf(Game);
});

test(`Create the Game with grid size '5x5'.`, () => {
    const size = GRID_SIZE['5x5'];
    const game = new Game(size);
    expect(game).toBeInstanceOf(Game);
});
