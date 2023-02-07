import { Job } from "../Jobs/Job";
import { Runnable } from "../Runnable";

export interface Agent extends Runnable
{
    poll(): Job[]; // returns jobs to complete
}