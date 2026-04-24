import { useParams } from "react-router-dom";
import MinesGame from "./Games/MinesGame";
import DiceGame from "./Games/DiceGame";

const GamePage = () => {
  const { gameSlug } = useParams();

  if (gameSlug === "mines") {
    return <MinesGame />;
  }

  if (gameSlug === "dice") {
    return <DiceGame />;
  }

  return <h1 className="text-white text-center mt-10">Game Not Found</h1>;
};

export default GamePage;