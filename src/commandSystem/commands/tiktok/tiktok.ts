import HugoCommand from "../../../objects/HugoCommand"
import DatabaseController from "../../../database/DatabaseController";

const command = new HugoCommand(
    "tiktok", 
    ["tiktok", "TikTok", "Tiktok"],
    "Creates a tiktok anouncement channel"
    );

command.execute = async (message, content) => {
    return new Promise<boolean>((resolve) => {
        DatabaseController.initializeTikTok(message.guild?.id ?? "", content ?? "", message.channel.id ?? "")
    });
}

export default command