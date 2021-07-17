import HugoNotificationController from "../../objects/notifications/HugoNotificationController";
import Logger from "../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger(`Event`);

/**
 * The event execute function
 */
export default async function execute() {
  logger.log("Executing disconnect event");
  HugoNotificationController.stop();
}
