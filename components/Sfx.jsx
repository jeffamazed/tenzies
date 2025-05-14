function Sfx(props) {
  const styles = {
    backgroundColor: props.sfx ? "#218838" : "#c82333",
    boxShadow: `0 1px 1px 1px ${props.sfx ? "#125c23" : "#78161f"}`
  };
  return (
    <button 
      style={styles} 
      className="sfx-btn"
      onClick={props.sfxToggle}
    >
      SFX
    </button>
  );
}