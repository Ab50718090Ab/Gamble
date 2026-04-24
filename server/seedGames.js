import mongoose from "mongoose";
import "dotenv/config";
import gameModel from "./models/game.model.js";

const games = [
  { name: "Mines Game", status: "active" },
  { name: "Dice Game", status: "active" }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await gameModel.deleteMany();
    await gameModel.insertMany(games);

    console.log("Games seeded successfully 🚀");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();