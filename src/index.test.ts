import min from 'lodash/min';
import max from 'lodash/max';
import Game, { GRID_SIZE, SLIDE_DIRECTION, SlideLimit } from '.';

Object.keys(GRID_SIZE).forEach((gridSize) => {
    // describe(`Game with grid size '3x3'.`, () => {
    const scaleExp = parseInt(gridSize, 10);

    const scale = GRID_SIZE[gridSize as keyof typeof GRID_SIZE];
    const game = new Game({ size: scale });
    const grid = game.getGrid();
    const limit = game.getSlideLimit();

    test(`Grid size '${gridSize}' is equal to expected scale '${scaleExp}'.`, () => {
        expect(scale).toEqual(scaleExp);
    });

    test(`Game created.`, () => {
        expect(game).toBeInstanceOf(Game);
    });

    test(`Scale is equal expected scale.`, () => {
        expect(game.getScale()).toEqual(scale);
    });

    test(`Grid has correct length.`, () => {
        expect(Array.isArray(grid)).toBeTruthy();
        expect(grid.length).toEqual(scale * scale);
    });

    test(`Grid has correct min val.`, () => {
        expect(min(grid)).toEqual(0);
    });

    test(`Grid has correct max val.`, () => {
        expect(max(grid)).toEqual(scale * scale - 1);
    });

    test(`Grid has correct empty cell index.`, () => {
        const emptyCellIndex = game.getEmptyCellIndex();
        expect(emptyCellIndex).toBeGreaterThanOrEqual(0);
        expect(emptyCellIndex).toBeLessThanOrEqual(scale * scale - 1);
    });

    test(`Limits is correct`, () => {
        const refLim: SlideLimit = {
            [SLIDE_DIRECTION.LEFT]:
                scale === GRID_SIZE['3x3']
                    ? [0, 3, 6]
                    : scale === GRID_SIZE['4x4']
                    ? [0, 4, 8, 12]
                    : scale === GRID_SIZE['5x5']
                    ? [0, 5, 10, 15, 20]
                    : [],
            [SLIDE_DIRECTION.RIGHT]:
                scale === GRID_SIZE['3x3']
                    ? [2, 5, 8]
                    : scale === GRID_SIZE['4x4']
                    ? [3, 7, 11, 15]
                    : scale === GRID_SIZE['5x5']
                    ? [4, 9, 14, 19, 24]
                    : [],
            [SLIDE_DIRECTION.UP]:
                scale === GRID_SIZE['3x3']
                    ? [0, 1, 2]
                    : scale === GRID_SIZE['4x4']
                    ? [0, 1, 2, 3]
                    : scale === GRID_SIZE['5x5']
                    ? [0, 1, 2, 3, 4]
                    : [],
            [SLIDE_DIRECTION.DOWN]:
                scale === GRID_SIZE['3x3']
                    ? [6, 7, 8]
                    : scale === GRID_SIZE['4x4']
                    ? [12, 13, 14, 15]
                    : scale === GRID_SIZE['5x5']
                    ? [20, 21, 22, 23, 24]
                    : [],
        };
        expect(limit).toStrictEqual<SlideLimit>(refLim);
    });
    // });
});
