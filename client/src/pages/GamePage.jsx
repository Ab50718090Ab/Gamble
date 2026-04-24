import { useParams } from "react-router-dom";
import MineGames from "./Games/MineGames";
import DiceGames from "./Games/DiceGames";

const GamePage = () => {
  const { gameSlug } = useParams();

  switch (gameSlug) {
    case "mines":
      return <MineGames />;
    case "dice":
      return <DiceGames />;
    default:
      return <h1 className="text-white">Game Not Found</h1>;
  }
};

export default GamePage;