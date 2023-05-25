import roles from "./roles/all";
import { SiteBuilder } from "./sites/Site";

// TODO 
//  - Save between ticks
//  - extract into class 
function pollRoom(room: Room)
{
    let sites  = [];
    let points = [
        ...room.find(FIND_MY_SPAWNS),
        ...room.find(FIND_SOURCES),
    ];

    for (let point of points)
        sites.push(
            new SiteBuilder(point.id)
                .addRoomArea(point.pos, 10)
                .addCreeps()
                .build()
        );

    return sites;
}

export function loop()
{
    let sites = [];
    for (let name in Game.rooms)
        sites.concat(pollRoom(Game.rooms[name]));

    // Run Creep funcs
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }
}