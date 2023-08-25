import Command from "../../framework/Command";
import RemoteHarvestProc from "../../processes/harvest/RemoteHarvestProc";

export default class RemoteHarvestCmd extends Command
{
    remoteRoomName  : string;
    source          : Id<Source>;
    drop            : Id<StructureStorage>;
 
    init(): void {
        this.drop = this.flag.room.find(FIND_STRUCTURES, {filter: x => x.structureType == STRUCTURE_STORAGE})[0].id as Id<StructureStorage>;
        
        let sp = this.flag.name.split(',');
        this.remoteRoomName = sp[0];
        this.source         = sp[1] as Id<Source>;
    }

    run(): void {
        this.createProcess(new RemoteHarvestProc(this.remoteRoomName+this.source, {
            remoteRoomName  : this.remoteRoomName,
            source          : this.source,
            drop            : this.drop
        }));

        this.remove();
    }
}