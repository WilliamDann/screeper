import { StepJob }      from "./Jobs/StepJob";
import { HarvestJob }   from "./Jobs/HarvestJob";
import { TransferJob }  from "./Jobs/TransferJob";
import { SpawnerAgent } from "./Agents/SpawnerAgent";
import { HarvestAgent } from "./Agents/HarvestAgent";
import { AgentController } from "./AgentController";

export function loop()
{
    // TODO yuck global
    globalThis.jobs = {
        'HarvestJob'    : HarvestJob.prototype,
        'TransferJob'   : TransferJob.prototype,
        'StepJob'       : StepJob.prototype,
    }

    let controller = new AgentController([
        new HarvestAgent('184df4aac96da15b62e42280', '486a98ef1abefbee83d368bd'),
        new SpawnerAgent('486a98ef1abefbee83d368bd')
    ]);

    controller.pre();
    controller.tick();
    controller.post();
}