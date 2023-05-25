// Strategy to repopulate a room low on creeps
import { Site } from "../sites/Site";
import { SiteBuilder } from "../sites/SiteBuilder";
import RoomStrat from "./RoomStrat";

export default (function(room: Room)
{
    let sites  = [] as Site[];
    let spawns = room.find(FIND_MY_SPAWNS);
    let points = [
        ...spawns,
        ...room.find(FIND_SOURCES),
    ];

    for (let point of points)
        sites.push(
            new SiteBuilder(point.id)
                .addRoomArea(point.pos, 10)
                .add_spawn(spawns[0])
                .addCreeps()
                .addObject('controller', room.controller)
                .build()
        );

    return sites;
}) as RoomStrat;