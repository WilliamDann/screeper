import { filter } from "lodash";
import { Site } from "../sites/Site";
import { SiteBuilder } from "../sites/SiteBuilder";
import containerEnergyHandler from "../sites/funcs/energy/containerEnergyHandler";
import harvestEnergyHandler from "../sites/funcs/energy/harvestEnergyHandler";
import genericRoleHandler from "../sites/funcs/roles/genericRoleHandler";
import oneRoleHandler from "../sites/funcs/roles/oneRoleHandler";
import anySpawnHandler from "../sites/funcs/spawn/anySpawnHandler";
import creepTick from "../sites/funcs/tick/creepTick";
import minPop from "../sites/funcs/tick/minPop";
import RoomStrat from "./RoomStrat";
import filteredRoleHandler from "../sites/funcs/roles/filteredRoleHandler";


function findSourceSpots(source: Source): number
{
    let area = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
    );
    area = area.filter(x => x.terrain != 'wall');
    return area.length;
}


function findPositionByPathLength(origin: RoomPosition, min: number, max: number): RoomPosition
{
    let area  = Game.rooms[origin.roomName].lookAtArea(
        origin.y - Math.floor(max / 2),
        origin.x - Math.floor(max / 2),
        origin.y + Math.floor(max / 2),
        origin.x + Math.floor(max / 2),
        false
        );

    let best: RoomPosition;
    let bestDist = Infinity;
    for (let x in area)
        for (let y in area[x])
        {
            // skip if blocker
            if (area[x][y].filter(x => x.terrain == 'wall' || x.structure).length != 0)
                continue;

            let dist = origin.findPathTo(parseInt(x), parseInt(y)).length;
            if (dist >= min && min < bestDist)
            {
                bestDist = dist;
                best     = new RoomPosition(parseInt(x), parseInt(y), origin.roomName);
            }
        }

    return best;
}

function addOrBuildContainer(room: Room, builder: SiteBuilder, sources: Site[], fillers=8)
{
    let origin    = Game.getObjectById(builder.site.identifier as any) as any;
    let containers = builder.site.objects.getContent('container') as StructureContainer[];
    if (containers.length != 0)
    {
        let fillPercent = containers[0].store.getUsedCapacity() / containers[0].store.getCapacity();
        builder.addOnTick(minPop, Math.ceil(fillers*fillPercent));

        for (let container of containers)
            for (let source of sources)
                source.objects.addContent('container', container.id);
    }
    else
    {
        let sites = builder.site.objects.getContent('constructionSite') as ConstructionSite[];
        sites     = filter(sites, x => x.structureType == 'container' || x.structureType == 'storage');

        if (sites.length == 0)
            room.createConstructionSite(findPositionByPathLength(origin.pos, 4, 6), 'container');
        else
            for (let site of sites)
                for (let source of sources)
                    source.objects.addContent('constructionSite', site.id);
    }

}

export default (function (room: Room) 
{
    let sources = [] as Site[];
    let sinks   = [] as Site[];

    let spawns = room.find(FIND_MY_SPAWNS);

    for (let source of room.find(FIND_SOURCES))
    {
        let spots = findSourceSpots(source)+1;
        let sb = new SiteBuilder(source.id)
            .setRoleHandler(genericRoleHandler)
            .addSpwanHandler(anySpawnHandler)
            .addEnergyHandler(harvestEnergyHandler)
            .addRoomArea(source.pos, 10)
            .addOnTick(creepTick)
            .addOnTick(minPop, spots)
            .addCreeps()
            .addObject('controller', room.controller.id)
        for (let spawn of spawns)
        {
            sb.addObject('spawn', spawn);
            sb.addObject('container', spawn);
        }
        sources.push(sb.build());
    }

    let ctrlBuilder = new SiteBuilder(room.controller.id)
        .setRoleHandler(filteredRoleHandler((x: Structure) => x?.structureType != 'container'))
        .addSpwanHandler(anySpawnHandler)
        .addEnergyHandler(containerEnergyHandler)
        .addRoomArea(room.controller.pos, 10)
        .addOnTick(creepTick)
        .addObject('controller', room.controller.id)
        .addCreeps()

    for (let spawn of spawns)
        ctrlBuilder.addObject('spawn', spawn.id)

    addOrBuildContainer(room, ctrlBuilder, sources);
    sinks.push(ctrlBuilder.build());

    for (let spawn of spawns)
    {
        let sb = new SiteBuilder(spawn.id)
            .setRoleHandler(filteredRoleHandler((x: Structure) => x?.structureType != 'container'))
            .addSpwanHandler(anySpawnHandler)
            .addEnergyHandler(containerEnergyHandler)
            .addRoomArea(spawn.pos, 20)
            .addOnTick(creepTick)
            .addCreeps()
            .addObject('spawn', spawn.id)
            .addObject('container', spawn.id)

        addOrBuildContainer(room, sb, sources, 8);
        sinks.push(sb.build());
    }

    return [...sources, ...sinks];
}) as RoomStrat