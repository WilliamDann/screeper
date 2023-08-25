import Command from "../../framework/Command";
import StaticDefenseProc from "../../processes/war/StaticDefenseProc";

export default class DefenseCmd extends Command
{
    init(): void {
        
    }

    run(): void {
        this.createProcess(new StaticDefenseProc(this.flag.room.name, {
            roomName: this.flag.room.name
        }));

        this.remove();
    }
}