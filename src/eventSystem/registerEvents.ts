import HugoClient from "../objects/HugoClient";
import Logger from "../tools/Logger";
import rawEvents from "./Events";

/**
 * The logger
 */
const logger = new Logger("EventLoader");

/**
 * The command execution function
 */
export default async (): Promise<void> => {
  let count = 0;
  for await (const rawEvent of rawEvents) {
    const eventPath = `./events/${rawEvent}`;
    let event = await import(eventPath);
    event = event.default;
    if (event instanceof Function) {
      HugoClient.on(rawEvent, event);
      HugoClient.events.push(rawEvent);
      logger.log(`Loaded ${rawEvent} event`);
      count++;
    } else {
      logger.error(`Could not load ${rawEvent} event`);
    }
  }
  const listedEventLength: number = rawEvents.length;

  logger.log(`Loaded ${count} out of ${listedEventLength} event/s`);
};
