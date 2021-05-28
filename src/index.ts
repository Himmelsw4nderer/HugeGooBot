import dotenv from "dotenv";
import registerCommands from "./commandSystem/registerCommands";
import registerEvents from "./eventSystem/registerEvents";
dotenv.config({ path: "./src/config.env" });
import Logger from "./tools/Logger";
const logger = new Logger("Bot");

//creating the client
import HugoClient from "./objects/HugoClient";

//logging in the client
Promise.all([registerCommands(), registerEvents()]).then(() => {
  logger.log(`Environment ready starting client`);
  HugoClient.login(process.env.DISCORD_TOKEN).then(() => {
    logger.log("Connected to Discord api");
  });
  //HugoClient.on("debug", console.log);
});
