import { Message, User } from "discord.js";
import HugoClient from "../../objects/HugoClient";
import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import dotenv from "dotenv";
dotenv.config({ path: "././././config.env" });

/**
 * The logger
 */
const logger = new Logger(`Event`);

/**
 * The event execute function
 * @param message The message from the event
 */
export default async function execute(message: Message) {
  logger.log(`Executing message event`);
  const commands = HugoClient.commands;
  if (message.guild) {
    let prefix = "§";
    const databaseServer = await DatabaseController.getServerById(
      message.guild.id
    );
    if (databaseServer?.prefix) prefix = databaseServer.prefix;
    let content = message.content;
    let botid: string = "";
    if (HugoClient.user) botid = HugoClient.user.id;
    if (content.startsWith(prefix) || message.mentions.users.has(botid)) {
      if (content.startsWith(prefix)) content = content.substr(prefix.length);
      if (message.mentions.users.has(botid)) content = content.split(` `)[1];
      for (const command of commands) {
        for (const trigger of command.trigger) {
          if (content.startsWith(`${trigger} `) || content == trigger) {
            logger.log(`Executing ${command.name} command`);
            if (await command.execute(message, content)) message.delete();
            break;
          }
        }
      }
    }
  }
}
