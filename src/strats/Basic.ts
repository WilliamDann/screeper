// Strategy to repopulate a room low on creeps
import { findSourceSpots, getFloatingEnergy } from "../funcs/misc";
import { SiteBuilder } from "../sites/SiteBuilder";
import anySpawnHandler from "../sites/funcs/spawn/anySpawnHandler";
import minPop from "../sites/funcs/tick/minPop";
import RoomStrat from "./RoomStrat";
import oneRole from "../sites/funcs/roles/oneRole";
import dropsHandler from "../sites/funcs/energy/dropsHandler";
import NestFactory from "../nest/NestFactory";
import anyRole from "../sites/funcs/roles/focusRole";
import { sortBy } from "lodash";
import harvestHander from "../sites/funcs/energy/harvestHander";
import templatePop from "../sites/funcs/tick/templatePop";
import trySpawn from "../sites/funcs/tick/trySpawn";
import roundRobinRole from "../sites/funcs/roles/roundRobinRole";
import maxPop from "../sites/funcs/tick/maxPop";
import Nest from "../nest/Nest";

function addSourceSites(nest: Nest, sources)
{
    for (let source of sources)
    {
        let spots = findSourceSpots(source);
        let site = new SiteBuilder(source.id)
            .addRoomArea(source.pos, 10)
            .addCreeps()
            .addOnTick(templatePop, spots, source.room.name, [MOVE, CARRY, WORK], [WORK, WORK, MOVE])
            .setRoleHandler(oneRole('staticHarvest', 'source'))
            .build();

        nest.addHandler('energy', dropsHandler, site)
            .addHandler('energy', harvestHander, site)
            .addSite(site);
    }

}

function addSpawnerSites(nest: Nest, spawners)
{
    for (let spawn of spawners)
    {
        let site = new SiteBuilder(spawn.id)
            .addRoomArea(spawn.pos, 5)
            .addObject('spawn', spawn.id)
            .addObject('controller', spawn.room.controller.id)
            .addCreeps()
            .addOnTick(minPop, 1, spawn.room.name)
            .setRoleHandler(anyRole)
            .build()

        nest.addHandler('spawn', anySpawnHandler, site)
            .addSite(site);
    }
}

function addWorkerSite(nest: Nest, sources: Source[], room: Room)
{
    let wsb = new SiteBuilder(room.controller.id)
        .addRoomArea(new RoomPosition(25, 25, room.name), 50)
        .addCreeps()
        .addObject('controller', room.controller.id)
        .setRoleHandler(roundRobinRole)

    if (getFloatingEnergy(wsb.site) >= room.energyCapacityAvailable && wsb.site.objects.getContent('creep').length < 30)
        wsb.addOnTick(trySpawn, room.name);
    else
        wsb.addOnTick(maxPop, 4*sources.length)

    let workerSite = wsb.build();
    nest.addSite(workerSite);

}

function tick(nest: Nest, room: Room)
{
    nest.tick();

    for (let baddie of room.find(FIND_HOSTILE_CREEPS))
        for (let tower of room.find(FIND_STRUCTURES, { filter: x => x.structureType == 'tower'}) as StructureTower[])
            tower.attack(baddie);
}
export default (function(room: Room)
{
    let nest     = NestFactory.getInstance(room.name);
    let spawners = room.find(FIND_MY_SPAWNS);
    let sources  = sortBy(room.find(FIND_SOURCES), x => spawners[0].pos.getRangeTo(x))

    addWorkerSite(nest, sources, room);
    addSourceSites(nest, sources);
    addSpawnerSites(nest, sources);

    tick(nest, room);
}) as RoomStrat;