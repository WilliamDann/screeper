import { StepJob }      from "./Jobs/StepJob";
import { HarvestJob }   from "./Jobs/HarvestJob";
import { TransferJob }  from "./Jobs/TransferJob";
import { SpawnerAgent } from "./Agents/SpawnerAgent";
import { HarvestAgent } from "./Agents/HarvestAgent";
import { AgentController } from "./AgentController";
import { UpgradeAgent } from "./Agents/UpgradeAgent";
import { WithdrawJob } from "./Jobs/WithdrawJob";
import { UpgradeJob } from "./Jobs/UpgradeJob";
import { BuildJob } from "./Jobs/BuildJob";
import { BuildAgent } from "./Agents/BuildAgent";
import { OptimizerAgent } from "./Agents/OptimizerAgent";
import { RepairJob } from "./Jobs/RepairJob";
import { MemoryDump } from "./MemoryDump";
import { CreepPool } from "./Agents/CreepPool";
import { JobQueue } from "./Agents/JobQueue";

export function loop()
{
    let md = new MemoryDump({
        // helpers
        'AgentController'   : AgentController.prototype,
        'CreepPool'         : CreepPool.prototype,
        'JobQueue'          : JobQueue.prototype,

        //agents
        'BuildAgent'        : BuildAgent.prototype,
        'HarvestAgent'      : HarvestAgent.prototype,
        'OptimizerAgent'    : OptimizerAgent.prototype,
        'SpawnerAgent'      : SpawnerAgent.prototype,
        'UpgradeAgent'      : UpgradeAgent.prototype,

        // jobs
        'HarvestJob'        : HarvestJob.prototype,
        'TransferJob'       : TransferJob.prototype,
        'WithdrawJob'       : WithdrawJob.prototype,
        'UpgradeJob'        : UpgradeJob.prototype,
        'BuildJob'          : BuildJob.prototype,
        'RepairJob'         : RepairJob.prototype,
        'StepJob'           : StepJob.prototype,
    });

    let source = Game.rooms.sim.find(FIND_SOURCES)[0].id;
    let spawn  = Game.spawns.Spawn1.id;
    let ctrl   = Game.rooms.sim.controller.id;

    let controller = new AgentController([
        new HarvestAgent(source, spawn),
        new SpawnerAgent(spawn),
        new UpgradeAgent(ctrl, undefined),
        new BuildAgent(spawn),
        new OptimizerAgent('sim')
    ]);

    if (Memory['controller'])
    {
        let obj = md.load(Memory['controller']);
        Object.assign(controller, obj);
        
        for (let child of controller.agents) // TODO removed because of circular, fix?
            child.controller = controller;
        
        controller.pre();
        controller.tick();
        controller.post();
    }

    Memory['controller'] = md.dump(controller, []);
}