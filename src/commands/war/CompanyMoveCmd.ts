import Command from "../../framework/Command";
import Processor from "../../framework/Processor";
import CompanyProc from "../../processes/war/CompanyProc";
import StaticDefenseProc from "../../processes/war/StaticDefenseProc";

export default class CompanyMoveCmd extends Command
{
    name    : string;
    station : RoomPosition;

    init(): void {
        this.name    = this.flag.name;
        this.station = this.flag.pos;
    }

    run(): void {
        // assign new station to proc
        Memory['processor']['processes'][`CompanyProc_${this.name}`].memory.station = this.station;

        // remove flag
        this.remove();
    }
}