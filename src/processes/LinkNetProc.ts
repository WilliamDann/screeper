import CreepProc from "./CreepProc";

// process to control links in a room
export default class LinkNetProc extends CreepProc
{
    baseLink: StructureLink;
    sublinks: StructureLink[];

    storage : StructureStorage;

    memory : {
        baseLink  : Id<StructureLink>;      // link connect to room storage
        storage   : Id<StructureStorage>    // the storage to drop materials in
        sublinks  : Id<StructureLink>[];    // other links in the room

        creepGoal : number;                 // 1 creep for transfering from link to store
        bodyGoal  : BodyPartConstant[]      // the body for the transferrer
    }

    // pull energy from sublinks
    pullFromSublinks()
    {
        for (let link of this.sublinks)
            link.transferEnergy(this.baseLink);
    }

    handleCreep(creep: Creep): void {
        this.pullFromSublinks();
        
        if (creep.withdraw(this.baseLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(this.baseLink);

        if (creep.transfer(this.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(this.storage);
    }

    init(): void {
        this.memory.creepGoal = 1;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [WORK, CARRY, MOVE];

        this.baseLink = Game.getObjectById(this.memory.baseLink);
        this.sublinks = this.memory.sublinks.map(Game.getObjectById) as StructureLink[];
        this.storage  = Game.getObjectById(this.memory.storage);

        super.init();
    }
}