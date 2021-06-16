# HugoBot
A discord Bot with multiple features

## ToDo
- [x] Basic bot features
- [x] Basic musicbot features
- [ ] TikTok upload notifications
- [ ] Slash command support
- [ ] more features :D

## Usage
1. Clone repository `git clone https://...`
2. Compile `tsc`
3. Add `src/config.env` with:
```env
DISCORD_TOKEN="{Your Token}"
COLOR="{Bot Embed Color}"
GOOGLE_API_KEY="{Your Google API Key}"
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
- `ping`
- `prefix`
- `changeprefix [new prefix]`
- `systeminfo`
### Music
- `play [song title]`
- `leave`
- `remove [song index]`
- `skip`
### TikTok
- `tiktok [tiktok username]`