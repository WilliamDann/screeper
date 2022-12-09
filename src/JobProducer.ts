import { JobRunner } from "./JobRunner";
import { JobData } from "./Jobs/Job";

export interface JobProducer
{
    jobRunner : JobRunner;
    tick() : void;
}