import Game, { SQUARE_SIZE } from './Game';

// @FIXME: добавил временно, потом нужно удалить
declare global {
    interface Window {
        doStep: (index: number) => boolean;
    }
}

const game = new Game(SQUARE_SIZE['4x4']);

game.printCurrentState();

window.doStep = (index: number): boolean => {
    const result = game.doStep(index);
    game.printCurrentState();
    return result;
};
