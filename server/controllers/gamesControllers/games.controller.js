import gameModel from "../../models/game.model.js";

/**
 * ✅ GET ALL GAMES
 * Route: /api/games/get-all-games
 */
export const getAllGames = async (req, res) => {
  try {
    const games = await gameModel.find();

    // যদি database খালি থাকে
    if (!games || games.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No games found",
        games: []
      });
    }

    res.status(200).json({
      success: true,
      count: games.length,
      games
    });

  } catch (error) {
    console.error("Error fetching games:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch games",
      error: error.message
    });
  }
};