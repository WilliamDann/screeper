import Core from "../Core";

// Information about events / shorthand for emitting events
export default class Event
{
    type   : string;
    data   : object;


    constructor(type: string, data: object)
    {
        this.type   = type;
        this.data   = data;
    }


    // emit the event to the event system
    emit()
    {
        Core.getInstance().eventSystem.emit(this);
    }


    // get a string version of the event
    toString()
    {
        return `Event type=${this.type}, data=${JSON.stringify(this.data)}`;
    }

}