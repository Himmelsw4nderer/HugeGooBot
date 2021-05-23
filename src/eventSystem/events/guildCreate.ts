import { Guild } from "discord.js";
import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
const logger = new Logger(`Event`);

export default function execute(guild: Guild) {
  logger.log("Executing guildCreate event");
  DatabaseController.initializeServer(guild.id.toString());
}
