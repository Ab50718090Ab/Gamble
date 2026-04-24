import mongoose from "mongoose";
import "dotenv/config";
import gameModel from "./models/game.model.js";

const games = [
  {
    name: "Mines Game",
    image: "/images/games/mines.png",
    status: "active"
  },
  {
    name: "Dice Game",
    image: "/images/games/dice.png",
    status: "active"
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to DB...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to DB ✔");

    // পুরনো data remove (optional but good)
    await gameModel.deleteMany();

    // নতুন data insert
    const createdGames = await gameModel.insertMany(games);

    console.log(`Games seeded successfully 🚀`);
    console.log("Inserted:", createdGames.length);

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("Seed error ❌:", error);
    process.exit(1);
  }
};

seedDB();