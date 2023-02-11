import { BuildJob } from "../Jobs/BuildJob";
import { HarvestJob } from "../Jobs/HarvestJob";
import { StepJob } from "../Jobs/StepJob";
import { TransferJob } from "../Jobs/TransferJob";
import { Agent } from "./Agent";
import { SpawnerAgent, SpawnRequest } from "./SpawnerAgent";

export class HarvestAgent extends Agent
{
    source  : string; // source id

    stage  : number;

    constructor(source: string, depo: string)
    {
        super();
        this.source = source;
        this.depo  = depo;

        this.stage = 0;
    }

    constructDepo()
    {
        let room         = Game.rooms[(Game.getObjectById(this.source as any) as any).room.name];
        let harvestAgent = this.controller.findAgentOfType("HarvestAgent") as HarvestAgent;
        let spawnAgent   = this.controller.findAgentOfType("SpawnerAgent") as SpawnerAgent;

        let source = Game.getObjectById(harvestAgent.source as any) as Source;
        let spawn  = Game.getObjectById(spawnAgent as any) as StructureSpawn;

        let path = source.pos.findPathTo(spawn);

        room.createConstructionSite(path[1].x, path[1].y, STRUCTURE_CONTAINER);
        for (let id in Game.constructionSites)
        {
            let site = Game.constructionSites[id];
            if (site.pos.x == path[1].x && site.pos.y == path[1].y)
                this.depo = id;
        }
    }

    tick(): void {
        const makeHarvestJob  = (src, to)  => new StepJob([ new HarvestJob(null, src), new TransferJob(null, to) ], this.constructor.name);
        const makeBuildJob    = (src, to)  => new StepJob([ new HarvestJob(null, src), new BuildJob(null, to) ],    this.constructor.name);

        let depo = Game.getObjectById(this.depo as any) as any;
        if (depo.progress != undefined)
            this.stage = 1
        else if (depo.structureType == STRUCTURE_CONTAINER)
            this.stage = 2

        switch (this.stage)
        {
            case 0:
                this.constructDepo()
            case 1:
                this.jobQueue.enqueue(makeBuildJob(this.source, this.depo), 1);
                break;
            case 2:
                this.jobQueue.enqueue(makeHarvestJob(this.source, this.depo), 1);
                break;
        }

        super.tick();
    }
}