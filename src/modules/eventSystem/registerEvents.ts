import HugoClient from "../objects/HugoClient"
import Logger from "../tools/Logger"
import rawEvents from "./Events"

const logger = new Logger('EventLoader')

export default async (): Promise<void> => {
    //initiating counter
    let count = 0;
    //for every event in the list
    for await(const rawEvent of rawEvents) {
        //creating the path for the event
        const eventPath = `./events/${rawEvent}`
        //importing the event
        let event = await import(eventPath)
        //getting the event itself
        event = event.default
        //validating the event
        if (event instanceof Function) {
            //register the Event
            HugoClient.on(rawEvent, event)
            logger.log(`Loaded ${rawEvent} event`)
            //count
            count++;
        } else {
            //logging the error
            logger.error(`Could not load ${rawEvent} event`)
        }
    }
    //calculating the size of the loading
    const listedEventLength: number = rawEvents.length

    //logging the result of the event loading
    logger.log(`Loaded ${count} out of ${listedEventLength} event/s`)
}