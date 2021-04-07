import min from 'lodash/min';
import max from 'lodash/max';
import Game, { GRID_SIZE } from '.';

type SIZE = '3x3' | '4x4' | '5x5';

(<SIZE[]>['3x3', '4x4', '5x5']).forEach((gridSize) => {
    // describe(`Game with grid size '3x3'.`, () => {
    const scaleExp = parseInt(gridSize, 10);

    const scale = GRID_SIZE[gridSize];
    const game = new Game(scale);
    const grid = game.getGrid();

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
    // });
});
