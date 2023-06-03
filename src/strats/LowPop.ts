// Strategy to repopulate a room low on creeps
import { sortBy } from "lodash";
import { Site } from "../sites/Site";
import { SiteBuilder } from "../sites/SiteBuilder";
import harvestEnergyHandler from "../sites/funcs/energy/harvestEnergyHandler";
import genericRoleHandler from "../sites/funcs/roles/genericRoleHandler";
import anySpawnHandler from "../sites/funcs/spawn/anySpawnHandler";
import creepTick from "../sites/funcs/tick/creepTick";
import minPop from "../sites/funcs/tick/minPop";
import RoomStrat from "./RoomStrat";
import { findSourceSpots } from "../funcs/misc";

export default (function(room: Room)
{
    let sites   = [] as Site[];
    let spawns  = room.find(FIND_MY_SPAWNS);
    let sources = sortBy(room.find(FIND_SOURCES), x => -spawns[0].pos.getRangeTo(x));

    for (let point of sources)
    {
        let spots = findSourceSpots(point);
        let sb = new SiteBuilder(point.id)
            .setRoleHandler(genericRoleHandler)
            .addSpwanHandler(anySpawnHandler)
            .addEnergyHandler(harvestEnergyHandler)
            .addCreeps();

        sb.addOnTick(creepTick);
        sb.addOnTick(minPop, spots+1);

        for (let spawn of spawns)
        {
            sb.addObject('spawn', spawn);
            sb.addObject('container', spawn);
        }

        sb.addObject('controller', point.room.controller);
        sb.addRoomArea(point.pos, 10);

        sites.push(sb.build());
    }
    return sites;
}) as RoomStrat;