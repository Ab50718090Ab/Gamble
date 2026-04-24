import { useParams } from "react-router-dom";
import MinesGame from "./Games/MinesGame";
import DiceGame from "./Games/DiceGame";

const GamePage = () => {
  const { gameSlug } = useParams();

  switch (gameSlug) {
    case "mines-game":
      return <MinesGame />;

    case "dice-game":
      return <DiceGame />;

    default:
      return (
        <h1 className="text-white text-center mt-10">
          Game Not Found
        </h1>
      );
  }
};

export default GamePage;