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
import { RepairJob } from "./Jobs/RepairJob";
import { MemoryDump } from "./MemoryDump";
import { CreepPool } from "./Agents/CreepPool";
import { JobQueue } from "./Agents/JobQueue";
import { ScalingAgent } from "./Agents/ScalingAgent";

export function loop()
{
    for (let name in Memory.creeps)
        if (!Game.creeps[name])
            delete Memory.creeps[name]

    let md = new MemoryDump({
        // helpers
        'AgentController'   : AgentController.prototype,
        'CreepPool'         : CreepPool.prototype,
        'JobQueue'          : JobQueue.prototype,

        //agents
        'BuildAgent'        : BuildAgent.prototype,
        'HarvestAgent'      : HarvestAgent.prototype,
        'SpawnerAgent'      : SpawnerAgent.prototype,
        'UpgradeAgent'      : UpgradeAgent.prototype,
        'ScalingAgent'      : ScalingAgent.prototype,

        // jobs
        'HarvestJob'        : HarvestJob.prototype,
        'TransferJob'       : TransferJob.prototype,
        'WithdrawJob'       : WithdrawJob.prototype,
        'UpgradeJob'        : UpgradeJob.prototype,
        'BuildJob'          : BuildJob.prototype,
        'RepairJob'         : RepairJob.prototype,
        'StepJob'           : StepJob.prototype,
    });

    let room   = Object.keys(Game.rooms)[0]
    let source = Game.rooms[room].find(FIND_SOURCES)[0].id;
    let spawn  = Game.spawns.Spawn1.id;
    let ctrl   = Game.rooms[room].controller.id;

    let controller = new AgentController([
        new ScalingAgent(),
        new HarvestAgent(source),
        new SpawnerAgent(spawn),
        new UpgradeAgent(ctrl),
        new BuildAgent(),
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