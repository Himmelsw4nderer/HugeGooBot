import Logger from "../../tools/Logger";
const logger = new Logger(`Event`);

export default function execute() {
  logger.log("Executing ready event");
}
