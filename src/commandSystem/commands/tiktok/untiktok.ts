import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { noPermissions } from "../../../tools/StandardReplys";
const logger = new Logger("Command");

const command = new HugoCommand(
    "untiktok", 
    ["untiktok", "unTikTok", "unTiktok"],
    "Removes the tiktok anouncement channel"
    );

command.execute = async (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            await DatabaseController.initializeTikTok(message.guild?.id ?? "");
            logger.log("Command sucessfully executed");
            resolve(true);
            return;
        } else {
            message.reply(noPermissions());
        }
        resolve(false)
    });
}

export default command