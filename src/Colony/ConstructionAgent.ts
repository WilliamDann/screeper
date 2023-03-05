import BuildJob from "../Jobs/BuildJob";
import Job from "../Jobs/Job";
import { findEnergySource } from "../Misc";

export default class ConstructionAgent
{
    jobs: Job[];

    constructor()
    {
        this.jobs = [];
    }

    tick()
    {

    }
}