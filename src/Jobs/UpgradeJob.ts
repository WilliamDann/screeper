import { Job, JobCode } from "./Job";

export class UpgradeJob implements Job
{
    jobCode : string;

    creep   : string;
    target  : string;

    constructor(creep:string|null=null, target:string|null=null)
    {
        if (creep)
            this.creep = creep;
        if (target)
            this.target = target;

        this.jobCode = "UpgradeJob";
    }

    run()
    {
        let creep = Game.creeps[this.creep];
        let target = Game.getObjectById(this.target as any) as StructureController;

        if (!creep || !target)
            return JobCode.InvalidJob;

        let code = creep.upgradeController(target) as number;

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
            return JobCode.FinishedOk;
        if (code == ERR_NOT_IN_RANGE)
            code = creep.moveTo(target);

        if ([OK, ERR_BUSY, ERR_TIRED].indexOf(code as any) == -1)
            return JobCode.FinishedError;
        return JobCode.Running;
    }
}