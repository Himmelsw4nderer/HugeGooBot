import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";
import { instagram } from "instagram-scraper-api";

/**
 * The logger
 */
const logger = new Logger("InstagramNotifications");

/**
 * Checks all tiktok channels in database for new content and creates a message notifing the discord
 * @returns A promise when ready
 */
async function checkInstagram(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const notifications = await DatabaseController.getNotificationsByType(
      "instagram"
    );
    for (let notification of notifications) {
      //const instagramChannel = await instagram.user(notification.place)
      //logger.debug(instagramChannel)
    }
    resolve();
  });
}

export { checkInstagram };