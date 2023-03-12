import Node from "../Nodes/Node";

export function typeNearRank(type: string, thisNode: Node, thatNode: Node): number
{
    if (thatNode.constructor.name != type)
        return -Infinity;

    let thisObj = Game.getObjectById(thisNode.tag as any) as _HasId & _HasRoomPosition;
    let thatObj = Game.getObjectById(thatNode.tag as any) as _HasId & _HasRoomPosition;
    if(!thatObj)
        return -Infinity;

    return thatObj.pos.getRangeTo(thisObj);

}

export function typeProductionRank(type: string, thatNode: Node)
{
    if (thatNode.constructor.name != type)
        return -Infinity;

    return thatNode.creeps.count * 10;
}