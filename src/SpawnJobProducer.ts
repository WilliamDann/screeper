import _ = require("lodash");
import { JobProducer }  from "./JobProducer";
import { JobRunner } from "./JobRunner";
import { HarvestJob } from "./Jobs/HarvestJob";
import { StepJob } from "./Jobs/StepJob";
import { TransferJob } from "./Jobs/TransferJob";

export class SpawnJobProducer implements JobProducer
{
    room        : Room;
    jobRunner   : JobRunner;
    createdJobs : string[];

    constructor(room: Room, jobRunner: JobRunner)
    {
        this.room       = room;
        this.jobRunner  = jobRunner;
    }

    removeFinishedJobs()
    {
        this.createdJobs = this.createdJobs.filter(x => this.jobRunner.get(x) != null);
    }

    tick()
    {
        let spawn = this.room.find(FIND_MY_SPAWNS)[0];

        this.removeFinishedJobs();
        if (this.createdJobs.length == 0)
            this.jobRunner.enqueue(new StepJob([
                new HarvestJob(
                    null,
                    _.sortBy(this.room.find(FIND_SOURCES), x => spawn.pos.getRangeTo(x.pos))[0].id
                ),
                new TransferJob(
                    null,
                    spawn.id
                ),
            ]));
    }
}