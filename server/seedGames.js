import mongoose from "mongoose";
import dotenv from "dotenv";
import gameModel from "./models/game.model.js";

dotenv.config();

const games = [
  { name: "Mines Game", status: "active" },
  { name: "Dice Game", status: "active" }
];

const seedDB = async () => {
  try {
    console.log("Connecting...");

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected ✔");

    await gameModel.deleteMany();
    await gameModel.insertMany(games);

    console.log("Games seeded successfully 🚀");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDB();