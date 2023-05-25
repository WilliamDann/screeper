// Responsible for spawning creeps
import Site, { OldSite } from "../src/sites/Site";

export default class extends OldSite
{
    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
        this.addContent("spawn", spawner);
    }

    canSpawn(body: BodyPartConstant[], name: string)
    {
        let spawner = this.getContent<StructureSpawn>('spawn')[0];
        return spawner.spawnCreep(body, name, { dryRun: true });
    }

    spawn(body: BodyPartConstant[], name: string, opts: SpawnOptions)
    {
        let spawner = this.getContent<StructureSpawn>('spawn')[0];
        return spawner.spawnCreep(body, name, opts);
    }

    tick()
    {

    }
}