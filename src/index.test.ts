import min from 'lodash/min';
import max from 'lodash/max';
import Game, { GRID_SIZE, SLIDE_DIRECTION, SlideLimit } from '.';

const gridSizes = Object.keys(GRID_SIZE).filter((key) => !Number.isNaN(Number(GRID_SIZE[key as keyof typeof GRID_SIZE])));
const referenceLimits: {
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

const referenceTransitions = {
    3: {
        'Left-Top': {
            grid: [0, 8, 7, 6, 5, 4, 3, 2, 1],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 1, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 3 },
        },
        'Right-Top': {
            grid: [1, 2, 0, 3, 4, 5, 6, 7, 8],
            transition: { [SLIDE_DIRECTION.RIGHT]: 1, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 5 },
        },
        'Left-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 0, 7, 8],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 7, [SLIDE_DIRECTION.DOWN]: 3, [SLIDE_DIRECTION.UP]: null },
        },
        'Right-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 7, 8, 0],
            transition: { [SLIDE_DIRECTION.RIGHT]: 7, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: 5, [SLIDE_DIRECTION.UP]: null },
        },
    },
    4: {
        'Left-Top': {
            grid: [0, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 1, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 4 },
        },
        'Right-Top': {
            grid: [1, 2, 3, 0, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            transition: { [SLIDE_DIRECTION.RIGHT]: 2, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 7 },
        },
        'Left-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 13, 14, 15],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 13, [SLIDE_DIRECTION.DOWN]: 8, [SLIDE_DIRECTION.UP]: null },
        },
        'Right-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0],
            transition: { [SLIDE_DIRECTION.RIGHT]: 14, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: 11, [SLIDE_DIRECTION.UP]: null },
        },
    },
    5: {
        'Left-Top': {
            grid: [0, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 1, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 5 },
        },
        'Right-Top': {
            grid: [1, 2, 3, 4, 0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            transition: { [SLIDE_DIRECTION.RIGHT]: 3, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: null, [SLIDE_DIRECTION.UP]: 9 },
        },
        'Left-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 0, 21, 22, 23, 24],
            transition: { [SLIDE_DIRECTION.RIGHT]: null, [SLIDE_DIRECTION.LEFT]: 21, [SLIDE_DIRECTION.DOWN]: 15, [SLIDE_DIRECTION.UP]: null },
        },
        'Right-Bottom': {
            grid: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 0],
            transition: { [SLIDE_DIRECTION.RIGHT]: 23, [SLIDE_DIRECTION.LEFT]: null, [SLIDE_DIRECTION.DOWN]: 19, [SLIDE_DIRECTION.UP]: null },
        },
    },
};

describe(`Basic tests:`, () => {
    test(`Game created with default config.`, () => {
        const game = new Game();
        expect(game).toBeInstanceOf(Game);
    });
    test(`Game not created with incorrect size.`, () => {
        expect(() => new Game({ size: 2 })).toThrow();
    });
    test(`Game not created with sorted grid.`, () => {
        expect(() => new Game({ size: 3, grid: [0, 1, 2, 3, 4, 5, 6, 7, 8] })).toThrow();
    });
});

describe(`Common tests:`, () => {
    for (const gridSize of gridSizes) {
        runCommonTests(gridSize);
    }
});

describe(`Simple game tests:`, () => {
    for (const gridSize of gridSizes) {
        runGameTests(gridSize);
    }
});

function runCommonTests(gridSize: string) {
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

        test(`Limits are correct.`, () => {
            expect(limit).toStrictEqual<SlideLimit>(referenceLimits[scale]);
        });

        // checkTransitions(gridSize);
    });
}

// function checkTransitions(gridSize: string) {
//     describe(`Transitions are correct:`, () => {

//     });
// }

function runGameTests(gridSize: string) {
    describe(`Game with grid size '${gridSize}'.`, () => {
        const scale = GRID_SIZE[gridSize as keyof typeof GRID_SIZE];

        test(`Left-Top transitions are correct.`, () => {
            const { grid, transition: refTransition } = referenceTransitions[scale]['Left-Top'];
            const game = new Game({ size: scale, grid });
            const transition = game.getTransition();
            expect(transition).toEqual(refTransition);
            expect(() => game.doSlide(SLIDE_DIRECTION.RIGHT)).toThrow();
            expect(() => game.doSlide(SLIDE_DIRECTION.DOWN)).toThrow();
            expect(game.doSlide(SLIDE_DIRECTION.LEFT));
            expect(game.doSlide(SLIDE_DIRECTION.RIGHT));
            expect(game.doSlide(SLIDE_DIRECTION.UP));
            expect(game.doSlide(SLIDE_DIRECTION.DOWN));
        });

        test(`Right-Top transitions are correct.`, () => {
            const { grid, transition: refTransition } = referenceTransitions[scale]['Right-Top'];
            const game = new Game({ size: scale, grid });
            const transition = game.getTransition();
            expect(transition).toEqual(refTransition);
            expect(() => game.doSlide(SLIDE_DIRECTION.LEFT)).toThrow();
            expect(() => game.doSlide(SLIDE_DIRECTION.DOWN)).toThrow();
            expect(game.doSlide(SLIDE_DIRECTION.RIGHT));
            expect(game.doSlide(SLIDE_DIRECTION.LEFT));
            expect(game.doSlide(SLIDE_DIRECTION.UP));
            expect(game.doSlide(SLIDE_DIRECTION.DOWN));
        });

        test(`Left-Bottom transitions are correct.`, () => {
            const { grid, transition: refTransition } = referenceTransitions[scale]['Left-Bottom'];
            const game = new Game({ size: scale, grid });
            const transition = game.getTransition();
            expect(transition).toEqual(refTransition);
            expect(() => game.doSlide(SLIDE_DIRECTION.RIGHT)).toThrow();
            expect(() => game.doSlide(SLIDE_DIRECTION.UP)).toThrow();
            expect(game.doSlide(SLIDE_DIRECTION.LEFT));
            expect(game.doSlide(SLIDE_DIRECTION.RIGHT));
            expect(game.doSlide(SLIDE_DIRECTION.DOWN));
            expect(game.doSlide(SLIDE_DIRECTION.UP));
        });

        test(`Right-Bottom transitions are correct.`, () => {
            const { grid, transition: refTransition } = referenceTransitions[scale]['Right-Bottom'];
            const game = new Game({ size: scale, grid });
            const transition = game.getTransition();
            expect(transition).toEqual(refTransition);
            expect(() => game.doSlide(SLIDE_DIRECTION.LEFT)).toThrow();
            expect(() => game.doSlide(SLIDE_DIRECTION.UP)).toThrow();
            expect(game.doSlide(SLIDE_DIRECTION.RIGHT));
            expect(game.doSlide(SLIDE_DIRECTION.LEFT));
            expect(game.doSlide(SLIDE_DIRECTION.DOWN));
            expect(game.doSlide(SLIDE_DIRECTION.UP));
        });
    });
}
