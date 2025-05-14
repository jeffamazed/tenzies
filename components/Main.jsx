function Main() {
  const [dice, setDice] = React.useState(() => generateAllNewDice());
  const [rollCount, setRollCount] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [hasReset, setHasReset] = React.useState(false);
  const [sfx, setSfx] = React.useState(true);
  const sfxLib = React.useMemo(() => ({
    diceRoll: new Audio("./audio/dice-roll-final.mp3"),
    diceSelect: new Audio("./audio/dice-select-final.mp3"),
    win: new Audio("./audio/win-final.mp3")
  }));

  // check if game is won
  const gameWon = dice.every(
    die => die.isHeld &&
    die.value === dice[0].value
  ); 

  const prevGameWon = React.useRef(false);
  const buttonRef = React.useRef(null);
  const firstDieRef = React.useRef(null);
  
  // focusing new game button and first die after new game
  React.useEffect(() => {
    if (gameWon) buttonRef.current.focus();
    else firstDieRef.current.focus();
  }, [gameWon]);

  // confetti
  React.useEffect(() => {
    if (!prevGameWon.current && gameWon) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { x: 0.5, y: 0.7 }
      });

      if (sfx) playSfx(sfxLib.win);
    }
    prevGameWon.current = gameWon;
    
  }, [gameWon]);

  function generateId() {
    return '_' + Math.random().toString(36).slice(2, 11);
  }  

  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => {
        const rand = Math.floor(Math.random() * 6) + 1;
        return {
          value: rand,
          isHeld: false,
          isRolling: false,
          id: generateId()
        };
      });
  } 

  function handleRollDice() {
    setDice(prevDie => prevDie.map(die =>
      die.isHeld ? die : { ...die, isRolling: true }  
    ));

    setTimeout(() => {
      setDice(prevDice => prevDice.map(die => {
        const rand = Math.floor(Math.random() * 6) + 1;
        return (
          die.isHeld ?
          die :
          { ...die, value: rand, isRolling: false }
        );
      }));
    }, 370);
  }

  function handleRollCount() {
    setRollCount(prevCount => prevCount + 1);
  }

  function handleButtonClick() {
    if (gameWon) {
      setIsTransitioning(true);

      setTimeout(() => {
        setDice(generateAllNewDice());
        setRollCount(0);
        setIsTransitioning(false);
        setHasReset(true);
      }, 200);

    } else {
      handleRollDice();
      handleRollCount();
      if (sfx) playSfx(sfxLib.diceRoll);
    }
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(die => 
      die.id === id ? 
      { ...die, isHeld: !die.isHeld } :
      { ...die }
    ));
  }

  function handleInstructionTexts() {
    return gameWon ?
      (
        <>
          {
            <p>
              {
                rollCount <= 5 ? "Impressive!" :
                rollCount <= 10 ? "Excellent!" :
                rollCount <= 15 ? "Great!" :
                rollCount <= 20 ? "Not bad!" :
                "It's not your day..."
              }
            </p>
          }
          <p>You won the game in {rollCount} roll(s).</p>
        </>
      ) :
      <p>Your goal: get all the dice to show the same number. Click a die to keep it from changing when you roll.</p>;
  }

  function handleSfxToggle() {
    setSfx(prev => !prev);
  }

  const playSfx = React.useCallback(sfx => {
    const soundNode = sfx.cloneNode();
    soundNode.play();
  }, []);

  const diceEls = dice.map((dieObj, i) => (
    <Die 
      key={dieObj.id} 
      value={dieObj.value} 
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
      isRolling={dieObj.isRolling}
      gameWon={gameWon}
      reference={i === 0 ? firstDieRef : null}
      playSfx={() => playSfx(sfxLib.diceSelect)}
      sfx={sfx}
    />
  ));

  return (
    <main className={`${isTransitioning ? "fade-out" : hasReset ? "fade-in" : ""}`}>
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to play again.</p>}
      </div>
      <div className="instruction-container">
        <h1>Tenzies</h1>
        {handleInstructionTexts()}
      </div>
      <div className="dice-container">
        {diceEls}
      </div>
      <button 
        className="roll-btn"
        onClick={handleButtonClick}
        ref={buttonRef}
      >
        {gameWon ? "New Game" : "Roll"}
      </button>
      <Sfx sfx={sfx} sfxToggle={handleSfxToggle} />
    </main>
  );
}

