import { first } from "lodash";
import Command from "../Command";
import Processor from "../../Processor";
import TestProc from "../../processes/TestProc";

// creates a SpawnerSite for the colony
export default class SeedCommand extends Command
{
    static commandName = 'colonize';

    static flagColorA  = COLOR_PURPLE;
    static flagColorB  = COLOR_GREY;


    constructor(flag: Flag)
    {
        super(flag);
    }


    // get a spawner in the room to be colonized assuming there is one already
    //  TODO in new rooms there wont be a spawner!
    private getSpawner(): StructureSpawn
    {
        return first(this.room.find(FIND_MY_SPAWNS));
    }


    init(): void {

    }


    run(): void {
        // spawn test process
        Processor.getInstance().registerProcess(new TestProc('testproc'));
        this.remove();
    }


    spawnProcesses(): void {

    }
}