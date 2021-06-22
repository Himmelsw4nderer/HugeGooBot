import HugoNotificationController from "../../objects/notifications/HugoNotificationController";
import Logger from "../../tools/Logger";
const logger = new Logger(`Event`);

export default async function execute() {
  logger.log("Executing ready event");
  HugoNotificationController.run()
}
