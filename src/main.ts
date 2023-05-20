import roles       from "./roles/all";
import HarvestSite from "./sites/HarvestSite";
import Site        from "./sites/Site";
import SpawnSite   from "./sites/SpawnSite";

function pollRoom(room: Room): Site[]
{
    let sources = [] as Site[];
    let spawns  = [] as Site[];

    for (let source of room.find(FIND_SOURCES))
        sources.push(new HarvestSite(source.id));

    for (let spawn of room.find(FIND_MY_SPAWNS))
    {
        for (let source of sources)
            source.addContent('container', spawn.id);
        spawns.push(new SpawnSite(spawn.id));
    }

    return [...sources, ...spawns];
}

function pollCreeps(sites: Site[])
{
    for (let name in Game.creeps)
    {
        const creep = Game.creeps[name];
        for (let site of sites)
            if (site.identifier == creep.memory['owner'])
                site.addContent('creep', creep.id);
    }
}

export function loop()
{
    // Create Sites
    let sites = [] as Site[];
    for (let room in Game.rooms)
        sites = sites.concat(pollRoom(Game.rooms[room]));

    // Add Creeps to Sites
    pollCreeps(sites);

    // Run Ticks
    sites.forEach(site => site.tick());

    // Run Creep funcs
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }
}