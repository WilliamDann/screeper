import CreepProc from "../CreepProc";

export default class StealProc extends CreepProc
{
    remoteRoomName  : string;
    steal           : StructureStorage;
    drop            : StructureStorage;

    memory: {
        remoteRoomName  : string;                   // the room to mine from
        steal           : Id<StructureStorage>;     // the source to steal from
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
            if (this.steal)
            {
                if (creep.withdraw(this.steal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(this.steal);
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
        this.steal         = Game.getObjectById(this.memory.steal);
        this.drop           = Game.getObjectById(this.memory.drop);

        if (!this.memory.creepGoal)
            this.memory.creepGoal = 1;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [WORK, CARRY, CARRY, MOVE, MOVE]

        super.init();
    }
}