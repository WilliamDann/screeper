import { Agent } from "./Agent";
import { HarvestAgent } from "./HarvestAgent";
import { SpawnerAgent } from "./SpawnerAgent";

export class OptimizerAgent extends Agent
{
    room: string;
    constructor(room: string)
    {
        super(`OptimizerAgent_${room}`);
        this.room = room;
    }

    findAgentsUsingSpawnDepos(): Agent[]
    {
        let agents = [];
        for (let agent of this.controller.agents)
        {
            let agentDepo = Game.getObjectById(agent.depo as any) as Structure;
            if (!agentDepo)
                continue;
            if (agentDepo.structureType == STRUCTURE_SPAWN)
                agents.push(agent);
        }
        return agents;
    }

    findDepos()
    {
        let room = Game.rooms[this.room];
        return room.find(FIND_STRUCTURES, {filter: x => x.structureType == STRUCTURE_CONTAINER}) as StructureContainer[];
    }

    deposInConstruction()
    {
        let sites = [];
        for (let siteId in Game.constructionSites)
        {
            let site = Game.constructionSites[siteId];
            if (site.room.name == this.room && site.structureType == STRUCTURE_CONTAINER)
                sites.push(siteId);
        }
        return sites;
    }

    constructDepo()
    {
        let room         = Game.rooms[this.room];
        let harvestAgent = this.controller.findAgentOfType(HarvestAgent) as HarvestAgent;
        let spawnAgent   = this.controller.findAgentOfType(SpawnerAgent) as SpawnerAgent;

        let source = Game.getObjectById(harvestAgent.source as any) as Source;
        let spawn  = Game.getObjectById(spawnAgent as any) as StructureSpawn;

        let path = source.pos.findPathTo(spawn);

        room.createConstructionSite(path[1].x, path[1].y, STRUCTURE_CONTAINER);
    }

    tick(): void {
        let spawnDepos = this.findAgentsUsingSpawnDepos();
        let depos      = this.findDepos();

        if (spawnDepos.length != 0)
            if (depos.length != 0)
                spawnDepos.forEach(x => x.depo = depos[0].id)
            else if (this.deposInConstruction().length == 0)
                this.constructDepo();
    }
}