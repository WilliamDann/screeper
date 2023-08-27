import Command from "../../framework/Command";
import ActiveDefenseProc from "../../processes/war/ActiveDefenseProc";

export default class ActiveDefenseCmd extends Command
{
    range    : number = 5;
    room     : Room;
    ramparts : StructureRampart[];

    init(): void {
        this.room     = this.flag.room;
        this.ramparts = this.flag.room
            .lookForAtArea(
                LOOK_STRUCTURES,
                this.flag.pos.y - this.range,
                this.flag.pos.x - this.range,
                this.flag.pos.y + this.range,
                this.flag.pos.x + this.range, 
            true)
            .filter(x => x.structure.structureType == STRUCTURE_RAMPART)
            .map(x => x.structure) as StructureRampart[];
    }

    run(): void {
        this.createProcess(new ActiveDefenseProc(this.flag.room.name, {
            roomName: this.flag.room.name,
            ramparts: this.ramparts.map(x => x.id)
        }));

        this.remove();
    }
}