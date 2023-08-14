// get the free spots around a point
export function freeSpots(pos: RoomPosition)
{
    let area = Game.rooms[pos.roomName].lookForAtArea(
        LOOK_TERRAIN,
        pos.y - 1,
        pos.x - 1,
        pos.y + 1,
        pos.x + 1,
        true
    );
    area = area.filter(x => x.terrain != 'wall');
    return area.length;
}