import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
import registerCommands from "./commandSystem/registerCommands";
import registerEvents from "./eventSystem/registerEvents";
import Logger from "./tools/Logger";
import HugoClient from "./objects/HugoClient";

/**
 * The logger
 */
const logger = new Logger("Bot");

/**
 * Starts the bot when environment is loaded
 */
Promise.all([registerCommands(), registerEvents()]).then(() => {
  logger.log(`Environment ready starting client`);
  HugoClient.login(process.env.DISCORD_TOKEN);
});