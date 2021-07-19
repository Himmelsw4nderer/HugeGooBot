import DatabaseController from "../../database/DatabaseController";
import Logger from "../../tools/Logger";
import HugoClient from "../HugoClient";
import { MessageEmbed, TextChannel } from "discord.js";
import TwitchApi from "node-twitch";

/**
 * The twitch api client
 */
const twitch = new TwitchApi({
  client_id: process.env.TWITCH_CLIENT_ID ?? "",
  client_secret: process.env.TWITCH_SECRET ?? "",
});

/**
 * The logger
 */
const logger = new Logger("TwitchNotifications");

/**
 * Checks all tiktok channels in database for new content and creates a message notifing the discord
 * @returns A promise when ready
 */
async function checkTwitch(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    const notifications = await DatabaseController.getNotificationsByType(
      "twitch"
    );
    for (let notification of notifications) {
      const result = await twitch
        .getStreams({
          channel: notification.place,
        })
        .catch(() => {
          resolve();
        });
      if (!result) {
        resolve();
        return;
      }
      const twitchStreams = result.data;
      if (twitchStreams.length > 0) {
        const twitchStream = twitchStreams[0];
        if (twitchStream.id != notification.last) {
          const twitchGame = await twitch
            .getGames(twitchStream.game_id)
            .catch(() => {
              resolve();
            });
          if (!twitchGame) {
            resolve();
            return;
          }
          const channel = await HugoClient.channels.fetch(notification.channel);
          if (channel.isText() && channel instanceof TextChannel) {
            const reply = new MessageEmbed()
              .setTitle(`${twitchStream.user_name} is now live`)
              .setDescription(twitchStream.title)
              .setColor(process.env.COLOR ?? 0x00000)
              .addFields(
                {
                  name: "Channel",
                  value: twitchStream.user_name,
                  inline: true,
                },
                {
                  name: "Game",
                  value: twitchGame.data[0].name,
                  inline: true,
                },
                {
                  name: "Link",
                  value: `https://www.twitch.tv/${twitchStream.user_name}`,
                  inline: false,
                }
              )
              .setFooter("HuGoBot")
              .setTimestamp();
            (await channel.send("@everyone,")).edit(reply);
          }
          DatabaseController.newLastOfNotification(
            notification.id,
            twitchStream.id
          );
        }
      }
    }
    resolve();
  });
}

export { checkTwitch };
