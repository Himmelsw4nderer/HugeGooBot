import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";
const TikTokScraper = require("tiktok-scraper");

/**
 * The logger
 */
const logger = new Logger("TikTokNotifications");

/**
 * Checks all tiktok channels in database for new content and creates a message notifing the discord
 * @returns A promise when ready
 */
async function checkTikTok(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const notifications = await DatabaseController.getNotificationsByType(
      "tiktok"
    );
    for (let notification of notifications) {
      const posts = await TikTokScraper.user(notification.place, {
        number: 1,
      });
      const video = posts.collector[0];
      if (video) {
        if (video.id != notification.last) {
          const channel = await HugoClient.channels.fetch(notification.channel);
          if (channel.isText() && channel instanceof TextChannel) {
            const reply = new MessageEmbed()
              .setTitle(
                `${video.authorMeta.nickName} has just uploaded a Video`
              )
              .setDescription(video.text)
              .setThumbnail(video.authorMeta.avatar)
              .setImage(video.covers.origin)
              .setColor(process.env.COLOR ?? 0x00000)
              .addFields(
                {
                  name: "Channel",
                  value: video.authorMeta.nickName,
                  inline: true,
                },
                { name: "Link", value: video.webVideoUrl, inline: true }
              )
              .setFooter("HuGoBot")
              .setTimestamp();
            (await channel.send("@everyone,")).edit(reply);
          }
          DatabaseController.newLastOfNotification(
            notification.id,
            posts.collector[0].id
          );
        }
      }
    }
    resolve();
  });
}

export { checkTikTok };
