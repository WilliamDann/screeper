import Comms from "../../framework/Comms";
import { freeSpots } from "../../util";
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
        popChecked      : boolean;                  // if we're sure the creep number for the soruce is accurate

        creepGoal: number;
        creeps?: string[];
        bodyGoal?: BodyPartConstant[];
    };

    handleCreep(creep: Creep): void {
        // drop
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            if (creep.transfer(this.drop, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                Comms.emit('creepMove', [creep, this.drop.pos]);
        }
        // mine
        else
        {
            // intel on source
            if (this.source)
            {
                if (creep.harvest(this.source) == ERR_NOT_IN_RANGE)
                    Comms.emit('creepMove', [creep, this.source.pos]);
            }
            // no intel on source
            else
            {
                Comms.emit('creepMove', [creep, new RoomPosition(25, 25, this.remoteRoomName)]);
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
        if (!this.memory.popChecked)
        {
            if (this.source)
            {
                this.memory.creepGoal  = freeSpots(this.source.pos);
                this.memory.popChecked = true;
            }
        }

        super.init();
    }
}