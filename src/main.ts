import { JobRunner }    from "./JobRunner";
import { StepJob }      from "./Jobs/StepJob";
import { HarvestJob }   from "./Jobs/HarvestJob";
import { TransferJob }  from "./Jobs/TransferJob";

export function loop()
{
    // TODO yuck
    globalThis.jobs = {
        'HarvestJob'    : HarvestJob.prototype,
        'TransferJob'   : TransferJob.prototype,
        'StepJob'       : StepJob.prototype,
    }

    let runner = new JobRunner();
    runner.setup();
    runner.tick();
    runner.teardown();
}