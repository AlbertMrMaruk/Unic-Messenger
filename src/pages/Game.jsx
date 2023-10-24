import { useCallback, useEffect, useState } from "react";
import words from "./wordList.json";
import Keyboard from "../components/game/Keyboard";
import HangmanDraw from "../components/game/HangmanDraw";
import HangmanWord from "../components/game/HangmanWord";

function Game({ setShowApp }) {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return words[Math.floor(Math.random() * words.length)];
  });

  const [guessLetters, setGuessLetters] = useState([]);

  // take and filter the letters we guess
  const incorrectLetters = guessLetters.filter(
    (letter) => !wordToGuess.includes(letter)
  );

  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess
    .split("")
    .every((letter) => guessLetters.includes(letter));

  const addGuessLetter = useCallback(
    (letter) => {
      if (guessLetters.includes(letter) || isLoser || isWinner) {
        return;
      } else {
        setGuessLetters((currentLetters) => [...currentLetters, letter]);
      }
    },
    [guessLetters, isLoser, isWinner]
  );

  // keyboard event handler
  useEffect(() => {
    const handler = (e) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) {
        return;
      } else {
        e.preventDefault();
        addGuessLetter(key);
      }
    };

    document.addEventListener("keypress", handler);

    return () => {
      document.removeEventListener("keypress", handler);
    };
  }, [guessLetters]);

  useEffect(() => {
    if (isWinner) {
    }
  }, [isWinner]);

  useEffect(() => {
    if (isLoser) {
    }
  }, [isLoser, wordToGuess]);

  return (
    <div className="bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-100 via-indigo-100 to-purple-200 h-screen">
      <div className="font-adlam max-w-3xl flex items-center flex-col gap-8 mx-auto pt-12">
        {/* I want to know how many times I chose the wrong letter */}
        <HangmanDraw numberOfGuess={incorrectLetters.length} />
        <HangmanWord
          result={isLoser}
          guessLetters={guessLetters}
          wordToGuess={wordToGuess}
        />
        <div className="self-stretch">
          <Keyboard
            disabled={isWinner || isLoser}
            activeLetter={guessLetters.filter((letter) =>
              wordToGuess.includes(letter)
            )}
            setShowApp={setShowApp}
            inactiveLetter={incorrectLetters}
            addGuessLetter={addGuessLetter}
          />
        </div>
      </div>
    </div>
  );
}

export default Game;
