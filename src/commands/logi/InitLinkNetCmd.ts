import Command      from "../../framework/Command";
import LinkNetProc  from "../../processes/LinkNetProc";

export default class LinkNetCmd extends Command
{
    baseLink    : StructureLink;
    storage     : StructureStorage;
    sublinks    : StructureLink[];

    init(): void {
        this.baseLink = this.flag.pos.lookFor(LOOK_STRUCTURES).filter(x => x.structureType == STRUCTURE_LINK)[0] as StructureLink;
        this.storage  = this.flag.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_STORAGE })[0] as StructureStorage;
        this.sublinks = this.flag.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_LINK && x.id != this.baseLink.id });
    }

    run(): void {
        // validate state
        if (!this.baseLink || !this.storage || this.sublinks.length == 0)
        {
            console.error('invalid starting state for LinkNetProc, killing');
            this.remove();
            return;
        }

        // create proc
        this.createProcess(new LinkNetProc(this.flag.room.name, {
            baseLink : this.baseLink.id,
            storage  : this.storage.id,
            sublinks : this.sublinks.map(x => x.id)
        }))

        // remove the command
        this.remove();
    }
}