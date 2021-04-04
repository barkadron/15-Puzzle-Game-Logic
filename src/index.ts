import Game, { GRID_SIZE, SLIDE_DIRECTION } from './Game';

declare global {
    interface Window {
        slideLeft: () => void;
        slideRight: () => void;
        slideUp: () => void;
        slideDown: () => void;
    }
}

const game = new Game(GRID_SIZE['4x4']);

printCurrentState(game);

// window.slideLeft = slideLeft;
// window.slideRight = slideRight;
// window.slideUp = slideUp;
// window.slideDown = slideDown;

document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
        case 'ArrowLeft':
            slideLeft();
            break;
        case 'ArrowRight':
            slideRight();
            break;
        case 'ArrowUp':
            slideUp();
            break;
        case 'ArrowDown':
            slideDown();
            break;
        default:
            break;
    }
});

function slideLeft() {
    slide(SLIDE_DIRECTION.LEFT);
}
function slideRight() {
    slide(SLIDE_DIRECTION.RIGHT);
}
function slideUp() {
    slide(SLIDE_DIRECTION.UP);
}
function slideDown() {
    slide(SLIDE_DIRECTION.DOWN);
}

function slide(direction: SLIDE_DIRECTION): void {
    game.doSlide(direction);
    printCurrentState(game);
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
