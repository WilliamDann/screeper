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

    }
}