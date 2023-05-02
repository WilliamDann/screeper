export default class Node<T extends _HasId>
{
    objId   : Id<T>;     // in-game object id

    constructor(objId: Id<T>)
    {
        this.objId = objId;
    }

    get object()
    {
        return Game.getObjectById(this.objId);
    }
}