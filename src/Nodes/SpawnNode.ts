import CollectJob from "../Job/CollectJob";
import Job from "../Job/Job";
import JobBuilder from "../Job/JobBuilder";
import TransferJob from "../Job/TransferJob";
import { typeNearRank, typeProductionRank } from "../Structures/Searches";
import { HarvestNode, ProtoHarvestNode } from "./HarvestNode";
import Node from "./Node";

export default class SpawnNode extends Node
{
    requests   : { [tag: string]: number }

    constructor(spawner: Id<StructureSpawn>)
    {
        super(spawner);
        this.requests    = {}
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

        globalThis.graph.verts[winner].creeps.add(name);
        this.requests[winner]--;
        if (0 >= this.requests[winner])
            delete this.requests[winner];
    }

    requestFill()
    {
        let spawner  = Game.getObjectById(this.tag as Id<StructureSpawn>);
        let node :HarvestNode|ProtoHarvestNode = graph.rankBfs(this.tag, x => typeProductionRank("HarvestNode", x)) as HarvestNode;
        
        if (!node)
            node = graph.rankBfs(this.tag, x => typeProductionRank("ProtoHarvestNode", x)) as ProtoHarvestNode;
        if (spawner.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            return;
        if (node.getJobsAssignedBy(this.tag).length != 0)
            return;

        node.jobs.add(
            new JobBuilder()
                .add(new CollectJob(node.pull as any))
                .add(new TransferJob(this.tag as any))
                .assigner(this.tag)
                .build()
        );
    }

    tick()
    {
        this.spawnNext();
        this.requestFill();
        super.tick();
    }
}