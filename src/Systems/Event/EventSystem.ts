import { info, warning } from "../Logging/log";
import EventHandler from "./EventHandler";

// In an event system the sender and sendee do not know about eachother
//  handler functions are registered and passed events whenever one is emitted
export default class EventSystem
{
    // event handler storage
    events : {[eventType: string]: EventHandler[]}


    constructor()
    {
        this.events  = {} as any;
    }


    // set a function to be called when an event is emitted
    register(eventType: string, func: EventHandler): void
    {
        if (!this.events[eventType])
            this.events[eventType] = [];
        this.events[eventType].push(func);
    }


    // stop a function from being called an event is emitted
    unregister(eventType: string, func: EventHandler): void
    {
        if (!this.events[eventType])
            return;
        this.events[eventType] = this.events[eventType].filter(x => x != func);
    }


    // send an event to each handler
    //  returns true if event was handled
    emit(eventName: string, event: object): boolean
    {
        if (!this.events[eventName])
        {
            warning(`Event dropped, no handler:${eventName}`);
            return false;
        }

        for (let handler of this.events[eventName])
            if (handler(event))
            {
                info(`Event handled: event:${event}`)
                return true;
            }

        warning(`Event dropped, no free handler:${eventName}`)
        return false;
    }
}