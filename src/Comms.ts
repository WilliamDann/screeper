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


    // emit a message to a channel
    static emit(channel: string, data: any)
    {
        for (let listner of this.listners[channel])
            listner(data);
    }
}