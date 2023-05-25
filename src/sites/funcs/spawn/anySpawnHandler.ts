export default function (requester: string, body: BodyPartConstant[], name?: string): boolean
{
    const spawnCreep = (spawn: StructureSpawn, dryRun=false) => 
        spawn.spawnCreep( body, name, { memory: {owner: requester}, dryRun: dryRun } ) == OK;

    let spawns = this.objects.getContent('spawn') as StructureSpawn[];
    for (let spawn of spawns)
        if (spawnCreep(spawn, true))
            return spawnCreep(spawn);

    return false;
}