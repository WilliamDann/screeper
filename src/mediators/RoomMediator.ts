import HarvestSite  from "../sites/HarvestSite";
import SpawnSite    from "../sites/SpawnSite";

export default class RoomMediator
{
    roomName     : string;

    harvestSites : HarvestSite[];
    spawnSites   : SpawnSite[];

    constructor(roomName: string)
    {
        this.roomName     = roomName;
        this.harvestSites = [];
        this.spawnSites   = [];
    }

    spawnRequest(requester: string, body: BodyPartConstant[], name?: string): boolean
    {
        if (!name)
            name = 'Creep_'+Game.time+'_'+requester;

        for (let site of this.spawnSites)
            if (site.canSpawn(body, name) == OK)
                return site.spawn(body, name, { memory: { owner: requester } }) == OK;
        return false;
    }

    tick()
    {
        [
            ...this.spawnSites,
            ...this.harvestSites
        ].forEach(x => x.tick());
    }
}