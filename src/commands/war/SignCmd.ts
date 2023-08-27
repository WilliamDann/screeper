import Command from "../../framework/Command";
import SignProc from "../../processes/war/SignProc";

export default class SignCmd extends Command
{
    roomName : string;
    text     : string;

    init(): void {
        let sp = this.flag.name.split(',');
        this.roomName = sp[0];
        this.text     = sp[1];       
    }

    run(): void {
        this.createProcess(new SignProc(this.flag.room.name, {
            roomName : this.roomName,
            text     : this.text
        }));

        this.remove();
    }
}