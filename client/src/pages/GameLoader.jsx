import { useParams } from "react-router-dom";
import MinesGame from "./Games/MinesGame";
import DiceGame from "./Games/DiceGame";

export default function GameLoader() {
    const { gameName } = useParams();

    switch (gameName) {
        case "mines":
            return <MinesGame />;

        case "dice-game":
            return <DiceGame />;

        default:
            return (
                <h1 className="text-white text-center mt-10">
                    Game not found
                </h1>
            );
    }
}