# HugoBot
A discord Bot with multiple features

## ToDo
- [x] Basic bot features
- [x] Basic musicbot features
- [x] TikTok upload notifications
- [ ] Slash command support
- [ ] More modern music bot features
- [ ] more features :D

## Usage
1. Clone repository `git clone https://...`
2. Compile `tsc`
3. Add `src/config.env` with:
```env
DISCORD_TOKEN="{Your Token}"
COLOR="{Bot Embed Color}"
```
4. Add the database `res/database/hugo.db`
```md
CREATE TABLE "Servers" (
	"id"	TEXT NOT NULL UNIQUE,
	"prefix"	TEXT NOT NULL DEFAULT '§',
	"tiktokchannel"	TEXT,
	"tiktoktextchannel"	TEXT,
	"tiktoklastvideo"	TEXT,
	PRIMARY KEY("id")
);
```
5. Run `npm start`

## Commands
### General
- `ping` - Replys pong
- `prefix` - Displays the current prefix of the server
- `changeprefix [new prefix]` - Sets a new prefix to the server
- `systeminfo` - displys the systeminfo of the bot
### Music
- `play [song title]` - Suggest a song
- `leave` - Removes the bot from the voice channel
- `remove [song index]` - Removes the song with the index (only admin and suggestor)
- `skip` - Skips the current playing song (only admin and suggestor)
### TikTok
- `tiktok [tiktok username]` - Adds TikTok notification in the channel
- `untiktok` - Removes TikTok notifications in the server