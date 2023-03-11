export function typeNearRank(type: string, a: Id<_HasId & _HasRoomPosition>, b: Id<_HasId & _HasRoomPosition>): number
{
    if (b.constructor.name != type)
        return -Infinity;

    let thisObj = Game.getObjectById(a);
    let thatObj = Game.getObjectById(b);

    return thatObj.pos.getRangeTo(thisObj);

}