import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand("ping", ["ping", "ping", "Ping"], "Ping!");

command.execute = (message) => {
  return new Promise<void>(() => {
    //constructing reply
    const reply = "pong";
    //sending response
    message.reply(reply);
    logger.log("Command sucessfully executed");
  });
};

export default command;
