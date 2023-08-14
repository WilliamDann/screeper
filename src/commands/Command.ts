// A command is an instruction to the bot
export default abstract class Command
{
    // concrete command info
    ref  : string;           // unique identifier of the command
    flag : Flag;             // the Flag attatched to the command


    constructor(flag: Flag)
    {
        this.flag = flag;
        this.ref = `${flag.name}@${flag.pos.x},${flag.pos.y},${flag.pos.roomName}`;
    }


    // initilizaiton logic
    abstract init(): void;


    // runtime logic
    abstract run(): void;


    // remove the command by removing it's flag
    remove()
    {
        this.flag.remove();
        this.flag = undefined;
    }
}