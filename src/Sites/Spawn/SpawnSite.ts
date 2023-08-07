import Core     from "../../Core";
import Handler from "../../Events/Handler";
import BaseSite from "../BaseSite";

export default class SpawnSite extends BaseSite<StructureSpawn>
{
    constructor(focus: Id<StructureSpawn>)
    {
        super(focus);
    }


    // hook up handlers
    init(): void {
        new Handler('spawnRequest', this.handleSpawnRequest.bind(this)).register();
    }


    // handler for spawn requests
    handleSpawnRequest(request: SpawnRequest): boolean
    {
        return false;
    }
}

export interface SpawnRequest
{
    body : BodyPartConstant[],
    for  : Id<_HasId>
}