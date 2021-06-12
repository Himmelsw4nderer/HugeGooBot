export default class HugoMusicSong {
  link: string;
  title: string;
  author: string;
  memberId: string;

  constructor(videoId: string, title: string, author: string, memberid: string){
    this.link = `https://www.youtube.com/watch?v=${videoId}`;
    this.title = title;
    this.author = author;
    this.memberId = memberid;
  }
}
