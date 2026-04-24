import { Router } from "express";
import minesRoutes from "./mines.routes.js";
import diceRoutes from "./dice.routes.js";
import { getAllGames } from "../../controllers/gamesControllers/games.controller.js";

const router = Router();

/**
 * ✅ ROOT: /api/games
 */
router.get("/", (req, res) => {
  res.json({
    message: "Games API is working 🚀"
  });
});

/**
 * ✅ GET ALL GAMES
 * /api/games/get-all-games
 */
router.get("/get-all-games", getAllGames);

/**
 * 🎮 Sub routes
 * /api/games/mines
 * /api/games/dice
 */
router.use("/mines", minesRoutes);
router.use("/dice", diceRoutes);

export default router;