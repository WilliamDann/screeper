import { first } from "lodash";
import Command from "../Command";
import SpawnerSite from "../../sites/SpawnerSite";

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
        const spawn = this.getSpawner();

        if (!spawn)
        {
            console.log("Colonize waiting, no spawner");
            return;
        }

        // create the spawner site
        this.colony.sites.push(new SpawnerSite(this.colony, spawn));
        this.remove();
    }


    spawnProcesses(): void {

    }
}