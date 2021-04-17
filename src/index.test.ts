import min from 'lodash/min';
import max from 'lodash/max';
import Game, { GRID_SIZE, SLIDE_DIRECTION, SlideLimit } from '.';

const gridSizes = Object.keys(GRID_SIZE).filter((key) => !Number.isNaN(Number(GRID_SIZE[key as keyof typeof GRID_SIZE])));
for (const gridSize of gridSizes) {
    runTests(gridSize);
}

function runTests(gridSize: string) {
    describe(`Game with grid size '${gridSize}'.`, () => {
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

        test(`Scale is equal to expected scale.`, () => {
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

        test(`Limits are correct`, () => {
            const limits: {
                [key in GRID_SIZE]: SlideLimit;
            } = {
                3: {
                    [SLIDE_DIRECTION.LEFT]: [0, 3, 6],
                    [SLIDE_DIRECTION.RIGHT]: [2, 5, 8],
                    [SLIDE_DIRECTION.UP]: [0, 1, 2],
                    [SLIDE_DIRECTION.DOWN]: [6, 7, 8],
                },
                4: {
                    [SLIDE_DIRECTION.LEFT]: [0, 4, 8, 12],
                    [SLIDE_DIRECTION.RIGHT]: [3, 7, 11, 15],
                    [SLIDE_DIRECTION.UP]: [0, 1, 2, 3],
                    [SLIDE_DIRECTION.DOWN]: [12, 13, 14, 15],
                },
                5: {
                    [SLIDE_DIRECTION.LEFT]: [0, 5, 10, 15, 20],
                    [SLIDE_DIRECTION.RIGHT]: [4, 9, 14, 19, 24],
                    [SLIDE_DIRECTION.UP]: [0, 1, 2, 3, 4],
                    [SLIDE_DIRECTION.DOWN]: [20, 21, 22, 23, 24],
                },
            };

            expect(limit).toStrictEqual<SlideLimit>(limits[scale]);
        });
    });
}
