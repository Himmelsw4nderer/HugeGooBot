import { Message, User } from "discord.js";
import HugoClient from "../../objects/HugoClient";
import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
const logger = new Logger(`Event`);
//loading environmental variables
import dotenv from "dotenv";
dotenv.config({ path: "././././config.env" });

export default async function execute(message: Message) {
  logger.log(`Executing message event`);
  //getting the commands
  const commands = HugoClient.commands;
  //checking if message on server
  if (message.guild) {
    //setting default value of prefix
    let prefix = "!";
    //loading the server of the message from the database
    const databaseServer = await DatabaseController.getServerById(
      message.guild.id
    );
    //checking if server has a prefix in database
    if (databaseServer?.prefix) prefix = databaseServer.prefix;
    //message content
    let content = message.content;
    //the bot id standard
    let botid: string = "";
    //if the client can deliver the id
    if (HugoClient.user) botid = HugoClient.user.id;
    //if it starts with prefix or has the bot mentioned
    if (content.startsWith(prefix) || message.mentions.users.has(botid)) {
      //content without prefix
      if (content.startsWith(prefix)) content = content.substr(prefix.length);
      //content without ping
      if (message.mentions.users.has(botid)) content = content.split(` `)[1];
      //for each command
      for (const command of commands) {
        //for each trigger in the command
        for (const trigger of command.trigger) {
          //if the content starts with the command
          if (content == trigger) {
            //executing the command function
            logger.log(`Executing ${command.name} command`);
            command.execute(message);
            //ending looking for the command
            break;
          }
        }
      }
    }
  }
}
