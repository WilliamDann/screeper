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

export function loop()
{
    // TODO yuck global
    globalThis.jobs = {
        'HarvestJob'    : HarvestJob.prototype,
        'TransferJob'   : TransferJob.prototype,
        'WithdrawJob'   : WithdrawJob.prototype,
        'UpgradeJob'    : UpgradeJob.prototype,
        'BuildJob'      : BuildJob.prototype,
        'StepJob'       : StepJob.prototype,
    }

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

    controller.pre();
    controller.tick();
    controller.post();
}