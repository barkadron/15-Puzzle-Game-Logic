const _ = require('underscore');

const SCALE = 4;

const DIRECTION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
};

const LIMIT = {
    LEFT: _.range(0, SCALE * SCALE - 1, SCALE),
    RIGHT: _.range(SCALE - 1, SCALE * SCALE, SCALE),
    UP: _.range(0, SCALE, 1),
    DOWN: _.range(SCALE * (SCALE - 1), SCALE * SCALE, 1),
};

const FIELD = initField();

// let hole = findHole();
// let transitions = calculateTransitions(hole);

printField();

function initField(): number[] {
    return <number[]>_.shuffle(_.range(0, SCALE * SCALE, 1));
}

function calculateTransitions(holeIndex: number) {
    const result: { [key: number]: { direction: string; targetIndex: number } } = {};

    const targetIndex = holeIndex;

    if (!LIMIT.LEFT.includes(holeIndex)) {
        const leftIndex = holeIndex - 1;
        result[leftIndex] = {
            direction: DIRECTION.RIGHT,
            targetIndex,
        };
    }

    if (!LIMIT.RIGHT.includes(holeIndex)) {
        const rightIndex = holeIndex + 1;
        result[rightIndex] = {
            direction: DIRECTION.LEFT,
            targetIndex,
        };
    }

    if (!LIMIT.UP.includes(holeIndex)) {
        const upIndex = holeIndex - SCALE;
        result[upIndex] = {
            direction: DIRECTION.DOWN,
            targetIndex,
        };
    }

    if (!LIMIT.DOWN.includes(holeIndex)) {
        const downIndex = holeIndex + SCALE;
        result[downIndex] = {
            direction: DIRECTION.UP,
            targetIndex,
        };
    }

    return result;
}

function getRowNum(index: number) {
    return Math.floor(index / SCALE) + 1;
}

function findHole() {
    let result = null;
    for (let i = 0; i < FIELD.length; i++) {
        if (FIELD[i] === 0) {
            result = i;
            break;
        }
    }

    if (result === null) {
        throw new Error('Ошибка! Не удалось найти пустую ячейку на поле.');
    }

    return result;
}

function printField() {
    const holeIndex = findHole();
    console.log('FIELD:');
    console.log('-----------------------------');
    let rowStart = 0;
    let rowEnd = SCALE;
    while (rowEnd <= FIELD.length) {
        console.log(FIELD.slice(rowStart, rowEnd).join('\t'));
        rowStart = rowEnd;
        rowEnd += SCALE;
    }
    console.log('-----------------------------');
    console.log('Hole index: ', holeIndex);
    console.log('Hole row: ', getRowNum(holeIndex));
    console.log('Limits: ', LIMIT);
    console.log('Transitions: ', calculateTransitions(holeIndex), '\n');
}
