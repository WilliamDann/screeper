import Systems from "../../Core/Systems";

export default class BaseEvent
{
    eventName: string;

    constructor(eventName="BaseEvent")
    {
        this.eventName = eventName;
    }

    emit()
    {
        Systems.getInstance().eventSystem.emit(this.eventName, this);
    }
}