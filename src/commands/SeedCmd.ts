import Command from "../framework/Command";


// the seed command is the first command run in a room
export default class SeedCmd extends Command
{
    constructor(flag: Flag)
    {
        super(flag);
    }


    init(): void
    {

    }


    run(): void
    {
        
        this.remove();
    }
}