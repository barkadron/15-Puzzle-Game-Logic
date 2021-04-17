import Game, { SLIDE_DIRECTION } from '../src';

declare global {
    interface Window {
        slideLeft: () => void;
        slideRight: () => void;
        slideUp: () => void;
        slideDown: () => void;
    }
}

enum KEYS {
    'ArrowLeft' = 'ArrowLeft',
    'ArrowRight' = 'ArrowRight',
    'ArrowUp' = 'ArrowUp',
    'ArrowDown' = 'ArrowDown',
}

type KeyMap = {
    [key in KEYS]: () => void;
};

const keyMap: KeyMap = {
    [KEYS.ArrowLeft]: slideLeft,
    [KEYS.ArrowRight]: slideRight,
    [KEYS.ArrowUp]: slideUp,
    [KEYS.ArrowDown]: slideDown,
};

const game = new Game();

printCurrentState(game);

window.slideLeft = slideLeft;
window.slideRight = slideRight;
window.slideUp = slideUp;
window.slideDown = slideDown;

document.addEventListener('keydown', (ev) => {
    const handler = keyMap[ev.key as KEYS];
    if (handler) {
        ev.preventDefault();
        ev.stopPropagation();
        handler();
    }
});

function slideLeft(): void {
    slide(SLIDE_DIRECTION.LEFT);
}
function slideRight(): void {
    slide(SLIDE_DIRECTION.RIGHT);
}
function slideUp(): void {
    slide(SLIDE_DIRECTION.UP);
}
function slideDown(): void {
    slide(SLIDE_DIRECTION.DOWN);
}

function slide(direction: SLIDE_DIRECTION): void {
    if (game && game.doSlide) {
        game.doSlide(direction);
        printCurrentState(game);
    }
}

function printCurrentState(g: Game): void {
    console.log('-'.repeat(33));
    let rowStart = 0;
    let rowEnd = g.getScale();
    while (rowEnd <= g.getGrid().length) {
        console.log('|\t', g.getGrid().slice(rowStart, rowEnd).join('\t|\t'), '\t|\n');
        console.log('-'.repeat(33));
        rowStart = rowEnd;
        rowEnd += g.getScale();
    }
    console.debug('EmptyCell index: ', g.getEmptyCellIndex());
    console.debug('Transition: ', g.getTransition(), '\n');
}
