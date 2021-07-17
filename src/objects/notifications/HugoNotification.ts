export default class HugoNotification {
  /**
   * Id of hugo notification in database
   */
  id: number;
  /**
   * Platform of hugo notification
   */
  type: string;
  /**
   * Discordchannel of hugo notification
   */
  channel: string;
  /**
   * Channel on platform of hugo notification
   */
  place: string;
  /**
   * Last result of hugo notification
   */
  last: string;

  /**
   * Creates an instance of hugo notification.
   * @param id Id of hugo notification in database
   * @param type Platform of hugo notification
   * @param channel Discordchannel of hugo notification
   * @param place Channel on platform of hugo notification
   * @param last Last result of hugo notification
   */
  constructor(
    id: number,
    type: string,
    channel: string,
    place: string,
    last: string
  ) {
    this.id = id;
    this.type = type;
    this.channel = channel;
    this.place = place;
    this.last = last;
  }
}
