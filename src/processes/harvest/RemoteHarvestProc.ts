import CreepProc from "../CreepProc";

export default class RemoteHarvestProc extends CreepProc
{
    remoteRoomName  : string;
    source          : Source;
    drop            : StructureStorage;

    memory: {
        remoteRoomName  : string;                   // the room to mine from
        source          : Id<Source>;               // the source to mine
        drop            : Id<StructureStorage>;     // where to drop material

        creepGoal: number;
        creeps?: string[];
        bodyGoal?: BodyPartConstant[];
    };

    handleCreep(creep: Creep): void {
        // drop
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            if (creep.transfer(this.drop, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.drop);
        }
        // mine
        else
        {
            // intel on source
            if (this.source)
            {
                if (creep.harvest(this.source) == ERR_NOT_IN_RANGE)
                    creep.moveTo(this.source);
            }
            // no intel on source
            else
            {
                creep.moveTo(new RoomPosition(25, 25, this.remoteRoomName));
            }
        }
    }

    init(): void {
        this.remoteRoomName = this.memory.remoteRoomName;
        this.source         = Game.getObjectById(this.memory.source);
        this.drop           = Game.getObjectById(this.memory.drop);

        if (!this.memory.creepGoal)
            this.memory.creepGoal = 1;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]

        super.init();
    }
}