import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";
import Logger from "../../../tools/Logger";
const logger = new Logger("Command");

const command = new HugoCommand(
    "untiktok", 
    ["untiktok", "unTikTok", "unTiktok"],
    "Removes the tiktok anouncement channel"
    );

command.execute = async (message, content) => {
    return new Promise<boolean>(async (resolve) => {
        await DatabaseController.initializeTikTok(message.guild?.id ?? "");
        logger.log("Command sucessfully executed");
        resolve(true);
        return;
    });
}

export default command