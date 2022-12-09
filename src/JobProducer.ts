import { JobRunner } from "./JobRunner";

export interface JobProducer
{
    jobRunner   : JobRunner;
    tick()      : void;
}