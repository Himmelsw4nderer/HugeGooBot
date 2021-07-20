import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";
import Youtube from "youtube.ts";
import YouTubeSR from "youtube-sr";

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
      const youtubeSRChannel = await YouTubeSR.searchOne(notification.place, "channel");
      const youtubeChannel = await youtube.channels
        .get(youtubeSRChannel.url ?? "")
        .catch((err) => {
          resolve();
          logger.error(err);
        });
      if (!youtubeChannel) {
        resolve();
        return;
      }
      const youtubeUploads = await YouTubeSR.getPlaylist(
        `https://www.youtube.com/playlist?list= ${youtubeChannel.contentDetails.relatedPlaylists.uploads}`,
        {limit: 1}
      );
      if (!youtubeUploads) {
        resolve();
        return;
      }
      const youtubeVideo = youtubeUploads.videos[0]
      if(youtubeVideo) if (youtubeVideo.id != notification.last) {
        const channel = await HugoClient.channels.fetch(notification.channel);
        if (channel.isText() && channel instanceof TextChannel) {
          const reply = new MessageEmbed()
            .setTitle(`${youtubeVideo.channel?.name ?? ""} has uploaded a new Videos`)
            .setDescription(youtubeVideo.title)
            .setColor(process.env.COLOR ?? 0x00000)
            .setThumbnail(youtubeChannel.snippet.thumbnails.default.url)
            .setImage(youtubeVideo.thumbnail?.url ?? "")
            .addFields(
              {
                name: "Channel",
                value: youtubeVideo.channel?.name ?? "",
                inline: true,
              },
              {
                name: "Link",
                value: `https://www.youtube.com/watch?v=${youtubeVideo.id ?? ""}`,
                inline: false,
              }
            )
            .setFooter("HuGoBot")
            .setTimestamp();
          (await channel.send("@everyone,")).edit(reply);
        }
        DatabaseController.newLastOfNotification(
          notification.id,
          youtubeVideo.id ?? ""
        );
      }
    }
    resolve();
  });
}

export { checkYouTube };
