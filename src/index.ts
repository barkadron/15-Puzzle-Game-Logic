// https://tyapk.ru/blog/post/correct-way-to-import-lodash-methods
// import range from 'underscore';
import shuffle from 'lodash/shuffle';
import range from 'lodash/range';

export enum GRID_SIZE {
    '3x3' = 3,
    '4x4' = 4,
    '5x5' = 5,
}

export enum SLIDE_DIRECTION {
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
    UP = 'UP',
    DOWN = 'DOWN',
}

export type SlideLimit = {
    [key in SLIDE_DIRECTION]: number[];
};

export type Transition = {
    [key in SLIDE_DIRECTION]: number | null;
};

export type SlideResult = {
    emptyCellIndex: number;
    transition: Transition;
};

export default class Game {
    private readonly scale: GRID_SIZE;

    private readonly grid: number[];

    private readonly slideLimit: SlideLimit;

    private emptyCellIndex: number;

    private transition: Transition;

    constructor(size: GRID_SIZE = GRID_SIZE['4x4']) {
        if (!(Number.isInteger(size) && Object.values(GRID_SIZE).includes(size))) {
            throw new Error(`Ошибка! Передан некорректный размер поля '${size}', невозможно начать игру.`);
        }

        this.scale = size;

        this.grid = shuffle(range(0, this.scale * this.scale, 1));

        this.slideLimit = {
            [SLIDE_DIRECTION.LEFT]: range(0, this.scale * this.scale - 1, this.scale),
            [SLIDE_DIRECTION.RIGHT]: range(this.scale - 1, this.scale * this.scale, this.scale),
            [SLIDE_DIRECTION.UP]: range(0, this.scale, 1),
            [SLIDE_DIRECTION.DOWN]: range(this.scale * (this.scale - 1), this.scale * this.scale, 1),
        };

        this.emptyCellIndex = this.findEmptyCellIndex();
        this.transition = this.findTransitions();
    }

    private findEmptyCellIndex(): number {
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i] === 0) {
                return i;
            }
        }

        throw new Error('Ошибка! Не удалось найти пустую ячейку на поле.');
    }

    private findTransitions(): Transition {
        const result: Transition = {
            [SLIDE_DIRECTION.RIGHT]: !this.slideLimit.LEFT.includes(this.emptyCellIndex) ? this.emptyCellIndex - 1 : null,
            [SLIDE_DIRECTION.LEFT]: !this.slideLimit.RIGHT.includes(this.emptyCellIndex) ? this.emptyCellIndex + 1 : null,
            [SLIDE_DIRECTION.DOWN]: !this.slideLimit.UP.includes(this.emptyCellIndex) ? this.emptyCellIndex - this.scale : null,
            [SLIDE_DIRECTION.UP]: !this.slideLimit.DOWN.includes(this.emptyCellIndex) ? this.emptyCellIndex + this.scale : null,
        };
        return result;
    }

    // public getEmptyCellRowNum(): number {
    //     return Math.floor(this.emptyCellIndex / this.scale) + 1;
    // }

    // public getSlideLimit(): slideLimit {
    //     return this.slideLimit;
    // }

    public getScale(): number {
        return this.scale;
    }

    public getGrid(): number[] {
        return this.grid;
    }

    public getEmptyCellIndex(): number {
        return this.emptyCellIndex;
    }

    public getTransition(): Transition {
        return this.transition;
    }

    public doSlide(direction: SLIDE_DIRECTION): { emptyCellIndex: number; transition: Transition } {
        const targetIndex = this.transition[direction];
        if (!(targetIndex != null && Number.isInteger(targetIndex) && targetIndex >= 0 && targetIndex < this.grid.length)) {
            throw new Error(`Ошибка! Передано некорректное направление '${direction}', невозможно сделать ход.`);
        }

        this.grid[this.emptyCellIndex] = this.grid[targetIndex];
        this.grid[targetIndex] = 0;
        this.emptyCellIndex = targetIndex;

        this.transition = this.findTransitions();

        return {
            emptyCellIndex: this.emptyCellIndex,
            transition: this.transition,
        };
    }
}
