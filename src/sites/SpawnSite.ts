// Responsible for spawning creeps
import Site from "./Site";

export default class extends Site
{
    constructor(spawner: Id<StructureSpawn>)
    {
        super();
        this.addContent("spawn", spawner);
    }

    tick()
    {
        let spawner = this.getContent<StructureSpawn>("spawn")[0];
        if (Object.keys(Game.creeps).length < 3)
            spawner.spawnCreep([WORK, CARRY, MOVE], Game.time+spawner.id);
    }
}