import { JobRunner }    from "./Jobs/JobRunner";
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

    let runner  = new JobRunner();
    let sa      = new SpawnerAgent('ac531d55b6a49c9354066adb');
    let ha      = new HarvestAgent('362f8681163cfdb38c95e6d4', 'ac531d55b6a49c9354066adb');

    sa.pre();
    runner.pre();

    if (runner.queue.length == 0)
    {
        sa.poll().forEach(job => runner.enqueue(job));
        ha.poll().forEach(job => runner.enqueue(job));
    }

    runner.tick();
    sa.tick();

    runner.post();
    sa.post();
}