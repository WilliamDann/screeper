import Command from "../../framework/Command";
import CompanyProc from "../../processes/war/CompanyProc";
import StaticDefenseProc from "../../processes/war/StaticDefenseProc";

export default class CompanyCmd extends Command
{
    name    : string;
    station : RoomPosition;

    init(): void {
        let sp   = this.flag.name.split(',');
        let name = sp[0],
            x    = parseInt(sp[1]),
            y    = parseInt(sp[2]),
            rm   = sp[3];

        this.name    = name;
        this.station = new RoomPosition(x, y, rm);
    }

    run(): void {
        // create proc
        this.createProcess(new CompanyProc(this.name, {
            station: this.station,

            creepGoal: 0
        }));

        // remove flag
        this.remove();
    }
}