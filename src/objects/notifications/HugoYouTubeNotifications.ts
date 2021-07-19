import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";
import Youtube from "youtube.ts";

/**
 * The youtube api
 */
const youtube = new Youtube(process.env.YOUTUBE_API_KEY ?? "");

/**
 * The logger
 */
const logger = new Logger("YouTubeNotifications");

/**
 * Checks all tiktok channels in database for new content and creates a message notifing the discord
 * @returns A promise when ready
 */
async function checkYouTube(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const notifications = await DatabaseController.getNotificationsByType(
      "youtube"
    );
    for (let notification of notifications) {
      const youtubeChannel = await youtube.channels
        .get(notification.place)
        .catch((err) => {
          resolve();
          logger.error(err);
        });
      logger.debug(youtubeChannel);
      if (!youtubeChannel) {
        resolve();
        return;
      }
      const youtubeUploads = await youtube.playlists
        .items(youtubeChannel.contentDetails.relatedPlaylists.uploads)
        .catch((err) => {
          resolve();
          logger.error(err)
        });
      logger.debug(youtubeUploads);
      if (!youtubeUploads) {
        resolve();
        return;
      }
      const youtubeVideo = youtubeUploads.items[0].snippet;
      if (youtubeVideo.resourceId.videoId != notification.last) {
        const channel = await HugoClient.channels.fetch(notification.channel);
        if (channel.isText() && channel instanceof TextChannel) {
          const reply = new MessageEmbed()
            .setTitle(`${youtubeVideo.channelTitle} has uploaded a new Videos`)
            .setDescription(youtubeVideo.title)
            .setColor(process.env.COLOR ?? 0x00000)
            .setThumbnail(youtubeChannel.snippet.thumbnails.default.url)
            .setImage(youtubeVideo.thumbnails.default.url)
            .addFields(
              {
                name: "Channel",
                value: youtubeVideo.channelTitle,
                inline: true,
              },
              {
                name: "Link",
                value: `https://www.youtube.com/watch?v=${youtubeVideo.resourceId.videoId}`,
                inline: false,
              }
            )
            .setFooter("HuGoBot")
            .setTimestamp();
          (await channel.send("@everyone,")).edit(reply);
        }
        DatabaseController.newLastOfNotification(
          notification.id,
          youtubeVideo.resourceId.videoId
        );
      }
    }
    resolve();
  });
}

export { checkYouTube };
