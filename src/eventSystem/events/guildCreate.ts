import { Guild } from "discord.js";
import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger(`Event`);

/**
 * The event execute function
 * @param guild The discord server
 */
export default function execute(guild: Guild) {
  logger.log("Executing guildCreate event");
  DatabaseController.initializeServer(guild.id.toString());
}
