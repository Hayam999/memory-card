import styles from "../App.module.css";
import logo from "../assets/logo.svg";

function MemoryCardLogo() {
  return (
    <div className={styles.memoryCardLogo}>
      <img id="memoLogo" src={logo} alt="Memory Card Logo" />
    </div>
  );
}

export default MemoryCardLogo;
