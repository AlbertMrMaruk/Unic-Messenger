import styles from "./Keyboard.module.css";

const KEYS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const Keyboard = ({
  activeLetter,
  inactiveLetter,
  addGuessLetter,
  disabled = false,
  setShowApp,
}) => {
  return (
    <div className="grid grid-cols-12 lg:grid-cols-75 gap-1 lg:gap-2">
      {KEYS.map((key) => {
        const isActive = activeLetter.includes(key);
        const isInactive = inactiveLetter.includes(key);
        return (
          <button
            onClick={() => {
              if (key === "z" || key === "x" || key === "y") {
                console.log("yeee");
                setShowApp((prev) => prev + 1);
              }
              addGuessLetter(key);
            }}
            className={`${styles.btn} 
            ${isActive ? styles.active : ""}
            ${isInactive ? styles.inactive : ""}`}
            disabled={isInactive || isActive || disabled}
            key={key}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;
