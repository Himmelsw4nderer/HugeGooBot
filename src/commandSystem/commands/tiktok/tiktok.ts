import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
import { Permissions } from "discord.js";
import { noPermissions } from "../../../tools/StandardReplys";
const logger = new Logger("Command");

const command = new HugoCommand(
    "tiktok", 
    ["tiktok", "TikTok", "Tiktok"],
    "Creates a tiktok anouncement channel"
    );

command.execute = async (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        content = content?.substr(7);
        if (message.member?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            if (content) {
                await DatabaseController.initializeTikTok(message.guild?.id ?? "", content, message.channel.id)
                logger.log("Command sucessfully executed");
                resolve(true);
                return;
            }
        } else {
            message.reply(noPermissions());
        }
        resolve(false);
    });
}

export default command