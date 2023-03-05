import BuildJob from "../Jobs/BuildJob";
import _HasStore from "../Misc";

export default class ConstructionOrder 
{
    pickup  : Id<_HasId>

    toPlace : StructureConstant[];
    toBuild : Id<ConstructionSite>[];

    pos     : RoomPosition;
    size    : number;

    assigner: string;

    constructor(pickup: Id<_HasId>, toPlace: StructureConstant[], pos: RoomPosition, size: number, assigner: string)
    {
        this.toPlace    = toPlace;
        this.toBuild    = [];

        this.pickup     = pickup;
        this.pos        = pos;
        this.size       = size;
        this.assigner   = assigner;
    }

    getSiteArea(room: Room)
    {
        let offset  = Math.floor(this.size / 2);
        let area    = room.lookAtArea(
            this.pos.y - offset,
            this.pos.x - offset,
            this.pos.y + offset,
            this.pos.x + offset, true
        );
        return area;
    }

    getSiteAreaCost(area): {}
    {
        let costs = {}
        for (let entry of area)
        {
            if (!costs[entry.y])
                costs[entry.y] = {};
            if (!costs[entry.y][entry.x])
                costs[entry.y][entry.x] = this.pos.getRangeTo(new RoomPosition(entry.x, entry.y, this.pos.roomName));

            switch (entry.type)
            {
                case 'terrain':
                    if (entry.terrain == 'swamp')
                        costs[entry.y][entry.x] += 5;
                    else if (entry.terrain == 'wall')
                        costs[entry.y][entry.x] += Infinity;
                    break;
                case 'source':
                case 'mineral':
                case 'structure':
                case 'constructionSite':
                    costs[entry.y][entry.x] += Infinity;
                    break;
            }
        }
        return costs;
    }

    findSiteLocation(str: StructureConstant, room: Room): RoomPosition
    {
        let area    = this.getSiteArea(room);
        let costs   = this.getSiteAreaCost(area);

        let minPos = null;
        let min    = Infinity;
        for (let x in costs)
        for (let y in costs[x])
            if (costs[x][y] < min)
            {
                min     = costs[x][y];
                minPos  = new RoomPosition(parseInt(x), parseInt(y), this.pos.roomName);
            }

        return minPos;
    }

    place(): void
    {
        this.toPlace = this.toPlace.filter(str => {
            let room = Game.rooms[this.pos.roomName];
            let loc  = this.findSiteLocation(str, room);

            if (room.createConstructionSite(loc, str) == OK)
                return false;

            console.error(`Cannot place: ${str}`);
            return true;
        });
    }

    filterFinishedSites()
    {
        this.toBuild = this.toBuild.filter(site => {
            let obj = Game.getObjectById(site);
            if (!obj || obj.progress == obj.progressTotal)
                return false;
            return true;
        });
    }

    makeBuildJobs(): BuildJob[]
    {
        let jobs = []
        for (let site of this.toBuild)
            jobs.push(new BuildJob(this.pickup, site));
        return jobs;
    }

    build(): BuildJob[]
    {
                this.filterFinishedSites();
        return  this.makeBuildJobs();
    }

    getBuilt(): Id<Structure>[]
    {
        let room    = Game.rooms[this.pos.roomName];
        let area    = this.getSiteArea(room);
        let structs = [] as Id<Structure>[];

        for (let entry of area)
            if (entry.type == 'structure')
                structs.push(entry.structure.id);

        return structs;
    }

    finished(): boolean
    {
        return this.toPlace.length == 0 && this.toBuild.length == 0;
    }
}