// allow communication between processes using an event system
export default class Comms
{
    static listners = {};

    // register a listner to a channel
    static register(channel: string, func: Function)
    {
        if (!this.listners[channel])
            this.listners[channel] = [];
        this.listners[channel].push(func);
    }


    // unregister a listner
    static unregister(channel: string, func: Function)
    {
        this.listners[channel] = this.listners[channel].filter(x => x != func);
    }


    // emit a message to a channel
    static emit(channel: string, data: any)
    {
        if (!this.listners[channel])
            return;

        for (let listner of this.listners[channel])
            if (listner(data))
                break;
    }
}