import Command from "../../framework/Command";
import StealProc from "../../processes/harvest/StealProc";

export default class StealCmd extends Command
{
    remoteRoomName  : string;
    steal          : Id<StructureStorage>;
    drop            : Id<StructureStorage>;
 
    init(): void {
        this.drop = this.flag.room.find(FIND_STRUCTURES, {filter: x => x.structureType == STRUCTURE_STORAGE})[0].id as Id<StructureStorage>;
        
        let sp = this.flag.name.split(',');
        this.remoteRoomName = sp[0];
        this.steal          = sp[1] as Id<StructureStorage>;
    }

    run(): void {
        this.createProcess(new StealProc(this.remoteRoomName+this.steal, {
            remoteRoomName  : this.remoteRoomName,
            steal           : this.steal,
            drop            : this.drop
        }));

        this.remove();
    }
}