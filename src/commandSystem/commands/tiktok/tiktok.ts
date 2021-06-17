import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
const logger = new Logger("Command");

const command = new HugoCommand(
    "tiktok", 
    ["tiktok", "TikTok", "Tiktok"],
    "Creates a tiktok anouncement channel"
    );

command.execute = async (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        content = content?.substr(7);
        if (content) {
            await DatabaseController.initializeTikTok(message.guild?.id ?? "", content, message.channel.id)
            logger.log("Command sucessfully executed");
            resolve(true);
            return;
        }
        resolve(false);
    });
}

export default command