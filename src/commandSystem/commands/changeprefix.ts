import { Message, MessageEmbed, Permissions } from "discord.js";
import DatabaseController from "../../database/DatabaseController";
import HugoCommand from "../../objects/HugoCommand";
import HugoServer from "../../objects/HugoServer";
import Logger from "../../tools/Logger";
import { noPermissions } from "../../tools/StandardReplys";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "changeprefix",
  ["changeprefix", "ChangePrefix", "change-prefix", "Change-Prefix"],
  "Changes the prefix of the server"
);

command.execute = (message, content) => {
  return new Promise<boolean>(async (resolve) => {
    //check if member has the permision admin
    if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      if (content?.split(" ").length ?? 0 < 1) notMatchGuidelines(message, "");
      //getting the new prefix out of the command
      const newPrefix = content?.split(" ")[1] ?? "";
      //if the new Prefix matches the
      const regex = new RegExp(`[&.,!"§$%&/()=?*'+#~_:;°^]\S{0,2}`);
      if (regex.test(newPrefix)) {
        //setting the new prefix to the database
        await DatabaseController.changeServer(
          new HugoServer(message.guild?.id ?? "", newPrefix)
        );
        message.reply(`Successfully changed the prefix to ${newPrefix}`);
        logger.log(`Changed prefix of a guild to ${newPrefix}`);
        resolve(true);
      } else {
        notMatchGuidelines(message, newPrefix);
        resolve(false);
      }
    } else {
      message.reply(noPermissions());
      logger.log("User has not enough permissions");
      resolve(false);
    }
  });
};

function notMatchGuidelines(message: Message, newPrefix: string) {
  //creating the embadded
  const reply = new MessageEmbed()
    .setTitle(`Could not change the Prefix`)
    .setColor(0xe84e43)
    .setDescription(
      `Can not change the prefix to ${newPrefix}. It does not match with Guidelines`
    )
    .addFields(
      {
        name: `First Letter:`,
        value: `Must be one of &.,!"§$%&/()=?*'+#~_:;°^`,
        inline: true,
      },
      {
        name: `Next two Letters`,
        value: `Anything but whitespaces`,
        inline: true,
      }
    )
    .setFooter("HuGoBot")
    .setTimestamp();
  //send embedded
  message.reply(reply);
  logger.log("New prefix does not match guidelines");
}

export default command;
