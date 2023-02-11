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
        if (this.creepPool.totalCreeps() < 3)
            this.spawnCreep();

        let depo = Game.getObjectById(this.depo as any) as any;
        if (depo.progress != undefined)
            this.stage = 1
        else if (depo.structureType == STRUCTURE_CONTAINER)
            this.stage = 2
        this.log(this.stage);
        switch (this.stage)
        {
            case 0:
                this.constructDepo()
            case 1:
                if (this.jobQueue.queue.length == 0)
                    this.jobQueue.enqueue(new StepJob([
                        new HarvestJob(null, this.source),
                        new BuildJob(null, this.depo)
                    ]));
                break;
            case 2:
                if (this.jobQueue.queue.length == 0)
                    this.jobQueue.enqueue(new StepJob([
                        new HarvestJob(null, this.source),
                        new TransferJob(null, this.depo)
                    ]));
                break;
        }

        super.tick();
    }
}