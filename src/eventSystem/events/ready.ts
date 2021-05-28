import Logger from "../../tools/Logger";
import Youtube from "youtube.ts";
const logger = new Logger(`Event`);

export default async function execute() {
  logger.log("Executing ready event");
  const youtube = new Youtube(process.env.GOOGLE_API_KEY ?? "")
}
