'use strict';

/* Browser wiring (Game.class.js also assigns window.Game) */
(function () {
  if (typeof window === 'undefined' || !window.Game) {
    return;
  }

  const game = new window.Game();

  const scoreEl = document.querySelector('.game-score');
  const btn = document.querySelector('.button');
  const cells = Array.from(document.querySelectorAll('.field-cell'));

  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');

  function render() {
    const state = game.getState();

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const i = r * 4 + c;
        const cell = cells[i];
        const val = state[r][c];

        cell.className = 'field-cell';
        cell.textContent = val ? String(val) : '';

        if (val) {
          cell.classList.add(`field-cell--${val}`);
        }
      }
    }

    // Handle score
    const score = game.getScore();

    scoreEl.textContent = score ? String(score) : '0';
    scoreEl.value = ''; // For test compatibility

    // Handle messages
    const gameStatus = game.getStatus();

    // Reset all messages
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');

    // Show appropriate message
    switch (gameStatus) {
      case 'idle':
        msgStart.classList.remove('hidden');
        break;
      case 'win':
        msgWin.classList.remove('hidden');
        break;
      case 'lose':
        msgLose.classList.remove('hidden');
        msgLose.style.removeProperty('display');
        break;
    }

    if (gameStatus === 'idle') {
      btn.textContent = 'Start';
      btn.classList.add('start');
      btn.classList.remove('restart');
    } else {
      btn.textContent = 'Restart';
      btn.classList.add('restart');
      btn.classList.remove('start');
    }
  }

  const keyToMove = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  document.addEventListener('keydown', (e) => {
    const fn = keyToMove[e.key];

    if (!fn) {
      return;
    }

    const gameState = game.getStatus();

    // Auto-start on arrow key
    if (gameState === 'idle') {
      game.start();
      render();

      return;
    }

    // Handle move
    if (gameState === 'playing') {
      const moved = fn();

      if (moved || game.getStatus() === 'lose') {
        render();
      }
    }
  });

  btn.addEventListener('click', () => {
    const gameState = game.getStatus();

    if (gameState === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    render();
  });

  render(); // initial paint
})();
