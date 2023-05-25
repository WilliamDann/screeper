// Responsible for using creeps to harvest at a given source
import {sortBy} from 'lodash'

export default class
{
    constructor(source : Id<Source>)
    {
        super(source);
        this.addContent("source", source);
    }

    findCreepRole(creep: Creep)
    {

    }

    resetCreepRole(creep: Creep)
    {
        delete creep.memory['role'];
        delete creep.memory['state'];
        delete creep.memory['target'];
    }

    findMiningSpots(): number
    {
        let source = this.getContent<Source>("source")[0]
        let area   = source.room.lookForAtArea(
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

    findPositionByPathLength(origin: RoomPosition, min: number, max: number): RoomPosition
    {
        console.log(origin)
        let area  = Game.rooms[origin.roomName].lookAtArea(
            origin.x - Math.floor(max / 2),
            origin.y - Math.floor(max / 2),
            origin.x + Math.floor(max / 2),
            origin.y + Math.floor(max / 2),
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

    roomAtMaxExtentions(): boolean
    {
        let room = (this.getContent('source')[0] as Source).room;
        let extentions = room.find(FIND_STRUCTURES, { filter: {structureType: STRUCTURE_EXTENSION} })
        return {
            1: 0,
            2: 5,
            3: 10,
            4: 20,
            5: 30,
            6: 40,
            7: 50,
            8: 60
        }[room.controller.level] > extentions.length;
    }

    tick()
    {
        let source = this.getContent<Source>('source')[0];
        this.poll(source.pos, 10);

        let containers = this.getContent<StructureContainer>('container');
        let sites      = this.getContent<StructureSpawn>('site');
        let creeps     = this.getContent<Creep>('creep');
        let danger     = this.getContent('danger');

        if (danger.length == 0)
        {
            if (sites.length == 0 && source.room.controller.level > 1)
                source.room.createConstructionSite(this.findPositionByPathLength(source.pos, 2, 4), 'extension');

            if (!this.roomAtMaxExtentions() && creeps.length < this.findMiningSpots() && danger.length == 0)
                RoomMediator.getInstance(source.room.name).spawnRequest(
                    this.identifier,
                    [WORK, CARRY, MOVE, MOVE],
                    'harvestSite'+Game.time
                );

            if (containers.length == 1 && sites.length == 0 && source.room.controller.level > 2)
                source.room.createConstructionSite(
                    this.findPositionByPathLength(source.pos, 3, 5),
                    'container'
                );
        }

        for (let creep of this.getContent('creep') as Creep[])
            if (!creep.memory['role'])
                this.findCreepRole(creep);
            else if (!creep.memory['state'])
                this.resetCreepRole(creep);
    }
}