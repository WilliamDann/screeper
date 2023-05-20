// Responsible for spawning creeps
import CreepMediator from "../mediators/CreepMediator";
import Site          from "./Site";

export default class extends Site
{
    constructor(spawner: Id<StructureSpawn>)
    {
        super();
        this.addContent("spawn", spawner);
        CreepMediator.getInstance().addProducer(this);
    }

    canSpawn(body: BodyPartConstant[], name: string)
    {
        let spawner = this.getContent<StructureSpawn>('spawn')[0];
        return spawner.spawnCreep(body, name, { dryRun: true });
    }

    spawn(body: BodyPartConstant[], name: string)
    {
        let spawner = this.getContent<StructureSpawn>('spawn')[0];
        return spawner.spawnCreep(body, name);
    }

    tick()
    {

    }
}