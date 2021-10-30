import "./styles.css";
import fscreen from "fscreen";

interface HUDProps {
  gameStatus: string;
  points: number;
  onRestartGame: () => void;
}

function HUD({ gameStatus, points, onRestartGame }: HUDProps) {
  if (gameStatus === "lost") {
    return (
      <div className="HUDScreen GameOverHUD">
        <div className="GameOverHUDContent">
          <h1>Game over</h1>
          <button type="button" onClick={onRestartGame}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === "won") {
    return (
      <div className="HUDScreen GameOverHUD">
        <div className="GameOverHUDContent">
          <h1>You win!</h1>
          <button type="button" onClick={onRestartGame}>
            Play again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="HUDScreen CounterHUD">
      <div className="CounterNumber" key={points}>
        {points}
      </div>
      <section className="Instructions">
        <h2>
          Instructions{" "}
          <button
            type="button"
            onClick={() => {
              fscreen.requestFullscreen(document.body);
            }}
          >
            Fullscreen
          </button>
        </h2>
        <p className="KeyboardInstructions">
          Use the <kbd className="Key">W</kbd>, <kbd className="Key">A</kbd>,{" "}
          <kbd className="Key">S</kbd>, <kbd className="Key">D</kbd> and{" "}
          <kbd className="Key">SPACE</kbd> keys to move.
        </p>
        <p className="JoystickInstructions">Touch left side to move.</p>
        <p>Bounce in every orange tile to win.</p>
      </section>
    </div>
  );
}

export { HUD };
