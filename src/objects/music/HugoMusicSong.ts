/**
 * A song whis song data
 */
export default class HugoMusicSong {
  /**The link of the song */
  link: string;
  /**The song title */
  title: string;
  /**The artist */
  author: string;
  /**The discord member id that requested the song */
  memberId: string;

  /**
   * Creates an insteance of HugoMusicSong
   * @param videoId The youtube video id of the song
   * @param title The song title
   * @param author The artist
   * @param memberid The discord member id that requested the song
   */
  constructor(
    videoId: string,
    title: string,
    author: string,
    memberid: string
  ) {
    this.link = `https://www.youtube.com/watch?v=${videoId}`;
    this.title = title;
    this.author = author;
    this.memberId = memberid;
  }
}
