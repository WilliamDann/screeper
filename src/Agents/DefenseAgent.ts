import { Agent }        from "./Agent";
import { SpawnerAgent } from "./SpawnerAgent";

export class DefenseAgent extends Agent
{
    constructor()
    {
        super();

        this.creepTarget    = 0;
        this.bodyTarget     = [];
    }

    tick()
    {
        let spawnAgent  = this.controller.findAgentOfType("SpawnerAgent") as SpawnerAgent;
        let spawner     = Game.getObjectById(spawnAgent.spawner as any) as StructureSpawn;

        let towers      = spawner.room.find(FIND_MY_STRUCTURES, {filter: x => x.structureType == STRUCTURE_TOWER}) as StructureTower[];
        let hostiles    = spawner.room.find(FIND_HOSTILE_CREEPS);

        if (towers.length == 0 || hostiles.length == 0)
            return;

        for (let tower of towers)
            tower.attack(hostiles[0]);

        super.tick();
    }
}