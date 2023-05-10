import Ticket from "../Ticket/Ticket";

export default class Node<T extends _HasId>
{
    objId   : Id<T>;     // in-game object id

    constructor(objId: Id<T>)
    {
        this.objId = objId;
    }

    tick(): void {
        return null;
    }

    get object()
    {
        return Game.getObjectById(this.objId);
    }
}