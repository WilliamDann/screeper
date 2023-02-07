import { StepJob }      from "./Jobs/StepJob";
import { HarvestJob }   from "./Jobs/HarvestJob";
import { TransferJob }  from "./Jobs/TransferJob";
import { SpawnerAgent } from "./Agents/SpawnerAgent";
import { HarvestAgent } from "./Agents/HarvestAgent";

export function loop()
{
    // TODO yuck global
    globalThis.jobs = {
        'HarvestJob'    : HarvestJob.prototype,
        'TransferJob'   : TransferJob.prototype,
        'StepJob'       : StepJob.prototype,
    }

    let agents = [];
    agents.push(new HarvestAgent('184df4aac96da15b62e42280', '486a98ef1abefbee83d368bd'));
    agents.push(new SpawnerAgent('486a98ef1abefbee83d368bd'));

    agents.forEach(agent => agent.pre());
    agents.forEach(agent => agent.tick());
    agents.forEach(agent => agent.post());
}