import RoomMediators from "./mediators/RoomMediators";
import RoomMediator from "./mediators/RoomMediators";
import roles        from "./roles/all";
import HarvestSite  from "./sites/HarvestSite";
import SpawnSite    from "./sites/SpawnSite";

function poll(roomName: string)
{
    const room    = Game.rooms[roomName];
    const inst    = RoomMediator.getInstance(roomName);
    const siteMap = {};

    // create harvest sites
    for (let source of room.find(FIND_SOURCES))
    {
        let site = new HarvestSite(source.id)
        inst.harvestSites.push(site);
        siteMap[source.id] = site;
    }

    // create spawn sites
    // also add spawn as containers to harvest sites
    for (let spawn of room.find(FIND_MY_SPAWNS))
    {
        let site = new SpawnSite(spawn.id);
        for (let harv of inst.harvestSites)
            harv.addContent('container', spawn.id);
        inst.spawnSites.push(site);
        siteMap[spawn.id] = site;
    }

    // add creeps to sites
    for (let name in Game.creeps)
    {
        const creep = Game.creeps[name];
        if (creep.pos.roomName == inst.roomName && creep.memory['owner'])
            siteMap[creep.memory['owner']].addContent('creep', creep.id);
    }
}

export function loop()
{
    // Create room mediators
    for (let room in Game.rooms)
        poll(room)

    // Run room mediators
    for (let room in Game.rooms)
        RoomMediator.getInstance(room).tick();

    // Run Creep funcs
    for(var name in Game.creeps) {
        const creep = Game.creeps[name];
        const role  = creep.memory['role'];
        if (!role)
            continue;

        roles[role](creep);
    }

    // for some reason static objects stick around in the game world??
    for (let room in Game.rooms)
        RoomMediators.clearInstance(room);
}