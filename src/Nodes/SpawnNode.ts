import Node from "./Node";

export default class SpawnNode extends Node
{
    requests   : { [tag: string]: number }

    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
        this.requests = {}
    }

    spawnLottery()
    {
        let opts = Object.keys(this.requests);
        let opt  = opts[ Math.floor(Math.random() * opts.length) ];

        return opt;
    }

    spawnNext()
    {
        let spawner = Game.getObjectById(this.tag as Id<StructureSpawn>);
        let winner  = this.spawnLottery();

        if (spawner.spawning || !winner)
            return;

        let name = `Creep-${Game.time}`;
        let code = spawner.spawnCreep(
            [WORK, CARRY, MOVE], // TODO custom bodies
            name
        );

        if ([-1, -3, -10, -14].indexOf(code) != -1)
            throw new Error(`Spawn Error: ${code}`);
        if (code == -4 || code == -6)
            return;

        globalThis.graph.verts[winner].creeps.push(name);
        this.requests[winner]--;
        if (0 >= this.requests[winner])
            delete this.requests[winner];
    }

    tick()
    {
        this.spawnNext();
        super.tick();
    }
}