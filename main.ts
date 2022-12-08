import { JobRunner }    from "./JobRunner";
import { StepJob }      from "./StepJob";
import { HarvestJob }   from "./HarvestJob";
import { TransferJob }  from "./TransferJob";

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

    if (runner.queue.length == 0)
    {
        let sj = new StepJob([
            new HarvestJob(null, Game.spawns.Spawn1.room.find(FIND_SOURCES)[0].id),
            new TransferJob(null, Game.spawns.Spawn1.id)
        ]);
        runner.queue.push(sj);
    }

    runner.tick();
    runner.teardown();
}