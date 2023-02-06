import { JobRunner }    from "./Jobs/JobRunner";
import { StepJob }      from "./Jobs/StepJob";
import { HarvestJob }   from "./Jobs/HarvestJob";
import { TransferJob }  from "./Jobs/TransferJob";
import { SpawnerAgent } from "./Agents/SpawnerAgent";

export function loop()
{
    // TODO yuck global
    globalThis.jobs = {
        'HarvestJob'    : HarvestJob.prototype,
        'TransferJob'   : TransferJob.prototype,
        'StepJob'       : StepJob.prototype,
    }

    let sa = new SpawnerAgent('029fdfc9c48d191051841690');
    sa.pre();
    sa.tick();
    sa.post();

    let runner = new JobRunner();
    runner.pre();
    runner.tick();
    runner.post();
}