import DatabaseController from "../../database/DatabaseController";
import HugoCommand from "../../objects/HugoCommand";
import Logger from "../../tools/Logger";
const logger = new Logger("Command");

//creating the command
const command = new HugoCommand(
  "prefix",
  ["prefix", "Prefix"],
  "Shows the current prefix on this server"
);

command.execute = (message) => {
  return new Promise<void>(async () => {
    const server = await DatabaseController.getServerById(
      message.guild?.id ?? ""
    );
    const prefix = (await server.prefix) ?? "!";
    //constructing reply
    const reply = `The prefix on this server is ${prefix}`;
    //sending response
    message.reply(reply);
    logger.log("Command sucessfully executed");
  });
};

export default command;
