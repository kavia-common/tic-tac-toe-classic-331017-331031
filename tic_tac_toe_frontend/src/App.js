import React, { useMemo, useState } from 'react';
import './App.css';

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  /** App-level game state for a simple local 2-player Tic Tac Toe. */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(
    () => !winner && squares.every((sq) => sq !== null),
    [winner, squares]
  );

  const statusText = useMemo(() => {
    if (winner) return `Winner: ${winner.player}`;
    if (isDraw) return 'Draw game';
    return `Next player: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, isDraw, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /** Place the current player's mark on an empty square; ignore if game is over. */
    if (winner || squares[index]) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = xIsNext ? 'X' : 'O';
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    /** Restart the game (clear board, X starts). */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  // PUBLIC_INTERFACE
  const clearBoardKeepTurn = () => {
    /** Clear board but keep whose turn it is (useful for quick rematches). */
    setSquares(Array(9).fill(null));
  };

  return (
    <div className="App">
      <main className="ttt-page">
        <section className="ttt-shell" aria-label="Tic Tac Toe game">
          <header className="ttt-header">
            <div className="ttt-titleblock">
              <h1 className="ttt-title">Tic Tac Toe</h1>
              <p className="ttt-subtitle">
                Local two-player • Alternating turns • Win/Draw detection
              </p>
            </div>

            <div className="ttt-status" role="status" aria-live="polite">
              <span className="ttt-status-label">Status</span>
              <span className="ttt-status-value">{statusText}</span>
            </div>
          </header>

          <div className="ttt-content">
            <div className="ttt-boardWrap">
              <div className="ttt-board" role="grid" aria-label="3 by 3 board">
                {squares.map((value, idx) => {
                  const isWinningSquare = Boolean(
                    winner?.line?.includes(idx)
                  );

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`ttt-square ${
                        value ? 'is-filled' : ''
                      } ${isWinningSquare ? 'is-winning' : ''}`}
                      onClick={() => handleSquareClick(idx)}
                      role="gridcell"
                      aria-label={`Square ${idx + 1}${
                        value ? `, ${value}` : ', empty'
                      }`}
                      aria-disabled={Boolean(winner || value)}
                      disabled={Boolean(winner || value)}
                    >
                      <span className="ttt-mark" aria-hidden="true">
                        {value}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="ttt-help">
                <div className="ttt-turnPills" aria-label="Current player">
                  <span className={`ttt-pill ${xIsNext ? 'is-active' : ''}`}>
                    X
                  </span>
                  <span className={`ttt-pill ${!xIsNext ? 'is-active' : ''}`}>
                    O
                  </span>
                </div>

                <p className="ttt-hint">
                  Tip: Tap an empty square to place your mark.
                </p>
              </div>
            </div>

            <aside className="ttt-controls" aria-label="Game controls">
              <button
                type="button"
                className="ttt-btn ttt-btnPrimary"
                onClick={restartGame}
              >
                Restart game
              </button>

              <button
                type="button"
                className="ttt-btn ttt-btnGhost"
                onClick={clearBoardKeepTurn}
              >
                Clear board (keep turn)
              </button>

              <div className="ttt-metaCard" aria-label="How to win">
                <h2 className="ttt-metaTitle">How to win</h2>
                <p className="ttt-metaText">
                  Make 3 in a row (row, column, or diagonal). If the board fills
                  with no winner, it’s a draw.
                </p>
              </div>
            </aside>
          </div>

          <footer className="ttt-footer">
            <span className="ttt-footerText">
              Built with React • Modern light theme
            </span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default App;
