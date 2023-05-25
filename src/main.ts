import roles from "./roles/all";
import { Site, SiteBuilder } from "./sites/Site";

// TODO 
//  - Save between ticks
//  - extract into class 
function pollRoom(room: Room)
{
    let sites  = [];
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
}

export function loop()
{
    // Build sites
    let sites = [] as Site[];
    for (let name in Game.rooms)
        sites = sites.concat(pollRoom(Game.rooms[name]));

    // Run tick funcs
    for (let site of sites)
        for (let tick of site.onTick)
            tick();

    // Run Creep funcs
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }

    // Sim room does not always destroy object on script exit
    sites = [];
}