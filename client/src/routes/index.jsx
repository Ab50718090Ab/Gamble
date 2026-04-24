import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Games from "@/pages/Games.jsx";
import GamePage from "@/pages/GamePage.jsx"; // ✅ NEW

import MinesGame from "@/pages/Games/MinesGame.jsx";
import DiceGame from "@/pages/Games/DiceGame.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },

      { path: "games", element: <Games /> },

      // ✅ Dynamic route
      { path: "games/:gameSlug", element: <GamePage /> },
    ],
  },
]);

export default router;