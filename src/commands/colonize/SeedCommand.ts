import { first } from "lodash";
import Command from "../Command";
import Processor from "../../Processor";
import BasicSpawnProc from "../../processes/spawn/BasicSpawnProc";

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


    init(): void {

    }


    run(): void {
        // create spawner process
        Processor.getInstance().registerProcess(
            new BasicSpawnProc(
                'BasicSpawnProc',
                { roomName: this.room.name }
            )
        )

        // remove the command
        this.remove();
    }


    spawnProcesses(): void {

    }
}