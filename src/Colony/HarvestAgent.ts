import Job from "../Jobs/Job";
import ConstructionOrder from "./ConstructionOrder";
import Site from "./ConstructionOrder";

export class HarvestSite
{
    container: Id<StructureContainer>;
    spots    : number;
}

export default class HarvestAgent
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