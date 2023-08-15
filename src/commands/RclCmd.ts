import Command from "../framework/Command";
import RclProc from "../processes/goal/RclProc";

export default class RclCmd extends Command
{
    goal      : number;
    upgraders : number;


    constructor(flag)
    {
        super(flag);
    }


    // parse cmd info from flag name
    init(): void
    {
        let pts        = this.flag.name.split(',')
        this.goal      = parseInt(pts[0]);
        this.upgraders = parseInt(pts[1]);
    }


    // create process
    run(): void
    {
        this.createProcess(new RclProc(
            this.flag.room.name,
            {
                goal      : this.goal,
                room      : this.flag.room.name,
                creepGoal : this.upgraders
            }
        ));

        this.remove();
    }
}