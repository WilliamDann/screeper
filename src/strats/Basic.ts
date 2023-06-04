// Strategy to repopulate a room low on creeps
import { findSourceSpots } from "../funcs/misc";
import { SiteBuilder } from "../sites/SiteBuilder";
import anySpawnHandler from "../sites/funcs/spawn/anySpawnHandler";
import minPop from "../sites/funcs/tick/minPop";
import RoomStrat from "./RoomStrat";
import oneRole from "../sites/funcs/roles/oneRole";
import dropsHandler from "../sites/funcs/energy/dropsHandler";
import NestFactory from "../nest/NestFactory";
import anyRole from "../sites/funcs/roles/anyRole";
import { sortBy } from "lodash";
import harvestHander from "../sites/funcs/energy/harvestHander";
import templatePop from "../sites/funcs/tick/templatePop";

export default (function(room: Room)
{
    let nest = NestFactory.getInstance(room.name);

    let spawners = room.find(FIND_MY_SPAWNS);
    let sources  = sortBy(room.find(FIND_SOURCES), x => spawners[0].pos.getRangeTo(x))

    let workerSite = new SiteBuilder(room.controller.id)
        .addRoomArea(new RoomPosition(25, 25, room.name), 50)
        .addCreeps()
        .addObject('controller', room.controller.id)
        .addOnTick(minPop, sources.length*4, room.name)
        .setRoleHandler(anyRole)
        .build()
    nest.addSite(workerSite);

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

        workerSite.objects.addContent('container', spawn.id);
    }

    nest.tick();

}) as RoomStrat;