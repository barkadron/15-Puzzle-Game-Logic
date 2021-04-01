const _ = require('underscore');

export enum SQUARE_SIZE {
    '3x3' = 3,
    '4x4' = 4,
    '5x5' = 5,
}

enum DIRECTION {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    UP = 'UP',
    DOWN = 'DOWN',
}

type MoveLimit = {
    [key in DIRECTION]: number[];
};

type Transitions = {
    [key: number]: DIRECTION;
};

export default class Game {
    private scale: number;

    private square: number[];

    private moveLimit: MoveLimit;

    private holeIndex: number;

    private transitions: Transitions;

    constructor(size: SQUARE_SIZE) {
        if (!(Number.isInteger(size) && Object.values(SQUARE_SIZE).includes(size))) {
            throw new Error(`Ошибка! Передан некорректный размер поля '${size}', невозможно начать игру.`);
        }

        this.scale = size;
        this.init();
    }

    private init = (): void => {
        this.square = <number[]>_.shuffle(_.range(0, this.scale * this.scale, 1));

        this.moveLimit = {
            LEFT: _.range(0, this.scale * this.scale - 1, this.scale),
            RIGHT: _.range(this.scale - 1, this.scale * this.scale, this.scale),
            UP: _.range(0, this.scale, 1),
            DOWN: _.range(this.scale * (this.scale - 1), this.scale * this.scale, 1),
        };

        this.holeIndex = this.findHole();
        this.transitions = this.findTransitions();
    };

    private findHole(): number {
        let result = null;
        for (let i = 0; i < this.square.length; i++) {
            if (this.square[i] === 0) {
                result = i;
                break;
            }
        }

        if (result === null) {
            throw new Error('Ошибка! Не удалось найти пустую ячейку на поле.');
        }

        return result;
    }

    private findTransitions(): Transitions {
        const result: Transitions = {};

        if (!this.moveLimit.LEFT.includes(this.holeIndex)) {
            const leftIndex = this.holeIndex - 1;
            result[leftIndex] = DIRECTION.RIGHT;
        }

        if (!this.moveLimit.RIGHT.includes(this.holeIndex)) {
            const rightIndex = this.holeIndex + 1;
            result[rightIndex] = DIRECTION.LEFT;
        }

        if (!this.moveLimit.UP.includes(this.holeIndex)) {
            const upIndex = this.holeIndex - this.scale;
            result[upIndex] = DIRECTION.DOWN;
        }

        if (!this.moveLimit.DOWN.includes(this.holeIndex)) {
            const downIndex = this.holeIndex + this.scale;
            result[downIndex] = DIRECTION.UP;
        }

        return result;
    }

    // private getHoleRowNum(): number {
    //     return Math.floor(this.holeIndex / this.scale) + 1;
    // }

    public getScale(): number {
        return this.scale;
    }

    public getHoleIndex(): number {
        return this.holeIndex;
    }

    public getTransitions(): Transitions {
        return this.transitions;
    }

    public doStep(targetIndex: number): boolean {
        const transition = this.transitions[targetIndex];
        if (!transition) {
            throw new Error(`Ошибка! Передан некорректный целевой индекс '${targetIndex}', невозможно сделать ход.`);
        }

        this.square[this.holeIndex] = this.square[targetIndex];
        this.square[targetIndex] = 0;
        this.holeIndex = targetIndex;

        this.transitions = this.findTransitions();

        return true;
    }

    public printCurrentState(): void {
        console.log('---------------------------');
        let rowStart = 0;
        let rowEnd = this.scale;
        while (rowEnd <= this.square.length) {
            console.log(this.square.slice(rowStart, rowEnd).join('\t\t'));
            rowStart = rowEnd;
            rowEnd += this.scale;
        }
        console.log('---------------------------');
        console.log('Hole index: ', this.holeIndex);
        // console.log('Hole row: ', this.getHoleRowNum());
        // console.log('Limits: ', this.moveLimit);
        console.log('Transitions: ', this.transitions, '\n');
    }
}
