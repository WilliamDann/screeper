import Colony from "../Colony";
import Site   from "./Site";

// interface for requesting a spawn
export interface SpawnRequest
{
    name     : string,
    body     : BodyPartConstant[],
    opts     : SpawnOptions,

    priority : number;              // lower = better
}

// handles using spawners to spawn creeps
export default class SpawnerSite extends Site
{
    spawnQueue: SpawnRequest[]; // spawn queue

    constructor(colony: Colony, spawner: StructureSpawn)
    {
        super(colony, spawner);
    }


    init(): void
    {

    }


    run(): void
    {

    }
}