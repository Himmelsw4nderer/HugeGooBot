import HugoTikTokController from "../../objects/tiktok/HugoTikTokController";
import Logger from "../../tools/Logger";
const logger = new Logger(`Event`);

export default async function execute() {
  logger.log("Executing ready event");
  HugoTikTokController.run()
}
