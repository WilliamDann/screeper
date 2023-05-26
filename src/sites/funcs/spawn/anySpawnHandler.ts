import SpawnHandler from "./SpawnHandler";

export default (function (name: string, body: BodyPartConstant[], opts: SpawnOptions): boolean
{
    const spawnCreep = (spawn: StructureSpawn, dryRun=false) => 
    {
        opts['dryRun'] = dryRun;
        return spawn.spawnCreep( body, name, opts) == OK;
    }

    let spawns = this.objects.getContent('spawn') as StructureSpawn[];
    for (let spawn of spawns)
        if (spawnCreep(spawn, true))
            return spawnCreep(spawn);

    return false;
}) as SpawnHandler