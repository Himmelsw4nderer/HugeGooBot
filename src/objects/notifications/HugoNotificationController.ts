import { sleep } from "../../tools/Sleep";
import { checkTikTok } from "./HugoTikTokNotifications";
import dotenv from "dotenv";
dotenv.config({ path: "./src/config.env" });
import Logger from "../../tools/Logger";

/**
 * The logger
 */
const logger = new Logger("NotificationController");

/**
 * Conroles the timing of Check for notifications
 */
class HugoNotificationController {
  /**If the bot is conected */
  connected: boolean = false;

  /** */
  waitTime: number = 2000;

  /**
   * Creates a incetance of HugoNotificationController
   */
  constructor() {
    const waitTimeString = process.env.NOTIFICATION_SPEED;
    if(waitTimeString){
      this.waitTime = +waitTimeString;
    }
  }

  /**
   * Start the checking for videos
   */
  async run() {
    this.connected = true;
    while (this.connected) {
      logger.log("Checking for new videos");
      await checkTikTok();
      await sleep(this.waitTime);
    }
  }

  /**
   * Stops the checking for videos
   */
  async stop() {
    this.connected = false;
  }
}

export default new HugoNotificationController()