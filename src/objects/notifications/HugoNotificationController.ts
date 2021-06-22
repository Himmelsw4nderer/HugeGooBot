import { sleep } from "../../tools/Sleep";
import { checkTikTok } from "./HugoTikTokNotifications";
import Logger from "../../tools/Logger";
const logger = new Logger("NotificationController");

class HugoNotificationController {
  connected: boolean = false;

  async run() {
    //setting the connection to true
    this.connected = true;
    //aslong as discord is connected
    while (this.connected) {
      logger.log("Checking for new videos");
      //check the tiktok accounts for new videos
      await checkTikTok();
      //sleep for 200 sek
      await sleep(200000);
    }
  }

  async stop() {
    //setting the connection to false
    this.connected = false;
  }
}

export default new HugoNotificationController()