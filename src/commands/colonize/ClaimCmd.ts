import Command from "../../framework/Command"
import ClaimProc from "../../processes/goal/ClaimProc";

export default class ClaimCmd extends Command
{
    target: string;

    init(): void {
        // find room
        this.target = this.flag.name;
    }

    run(): void {
        if (!this.target)
            return this.remove();

        // spawn claim proc
        this.createProcess(new ClaimProc(this.target, { roomName: this.target }));

        // remove cmd
        this.remove();
    }
}