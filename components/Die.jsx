function Die(props) {
  const heldStyleI = {
    color: "#59e391",
  };

  const heldStyleButton = {
    boxShadow: "0 3px 3px 2px #228B22",
    pointerEvents: !props.gameWon ? "auto" : "none"
  }

  const diceValue ={
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six"
  }

  function handleOnClick() {
      if (props.sfx) props.playSfx();
      props.hold();
  }

  return (
    <button 
      className={`die ${props.isRolling ? "rolling" : undefined}`} 
      style={props.isHeld ? heldStyleButton : undefined}
      onClick={handleOnClick}
      aria-label={`Die with value ${props.value}, 
        ${props.isHeld ? "held" : "not held"}`}
      aria-pressed={props.isHeld}
      ref={props.reference}
    >
      <i 
        className={`fas fa-dice-${diceValue[props.value]}`}
        style={props.isHeld ? heldStyleI : undefined}
      ></i>
    </button>
  );
}