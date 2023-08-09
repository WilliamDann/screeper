import Process from "../../processes/Process";
import Command from "../Command";

export default class HarvestCommand extends Command
{
    // command info
    static commandName = 'harvest';

    static flagColorA  = COLOR_YELLOW;
    static flagColorB  = COLOR_YELLOW;

    // concrete info
    memory    : object;
    processes : {
        mine: Process
    }


    constructor(flag: Flag)
    {
        super(flag);
    }


    init(): void
    {

    }


    run(): void
    {

    }


    spawnProcesses(): void
    {

    }
}