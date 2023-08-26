import { sortBy } from "lodash";
import CreepProc  from "../CreepProc";

// increase attack cost in waves
export default class WaveAttackProc extends CreepProc
{
    stageRoom  : Room;
    targetRoom : Room;
    targets    : _HasId[];

    memory: {
        stageRoom  : string;
        targetRoom : string;
        targets    : Id<_HasId>[];
        
        go         : boolean;

        creepGoal : number;
        creeps   ?: string[];
        bodyGoal ?: BodyPartConstant[];
    };

    handleCreep(creep: Creep): void {
        if (this.memory.go)
        {
            // move to room
            if (creep.pos.roomName != this.memory.targetRoom)
            {
                creep.moveTo(new RoomPosition(25, 25, this.memory.targetRoom));
                return;
            }
    
            // find attacking target
            let target = Game.getObjectById(creep.memory['target']) as any;
            if (!target)
            {
                if (this.targets.length == 0)
                {
                    creep.memory['target'] = sortBy(creep.room.find(FIND_HOSTILE_CREEPS), x => x.pos.getRangeTo(creep))[0]?.id;
                }
                else
                {
                    creep.memory['target'] = sortBy(this.targets, x => creep.pos.getRangeTo(x as any))[0].id;
                }
            }
        
            // attack it!
            if (creep.attack(target) == ERR_NOT_IN_RANGE)
                creep.moveTo(target);
        }
        else {
            // move to staging area
            let stage = new RoomPosition(25, 25, this.memory.stageRoom);
            if (creep.pos.getRangeTo(stage) > 5)
                creep.moveTo(stage);
        }
    }

    init(): void {
        if (!this.memory.creepGoal)
            this.memory.creepGoal = 1;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [ATTACK, TOUGH, MOVE];
        if (!this.memory.targets)
            this.memory.targets = [];
        if (!this.memory.go)
            this.memory.go = false;

        this.stageRoom  = Game.rooms[this.memory.stageRoom];
        this.targetRoom = Game.rooms[this.memory.targetRoom];
        this.targets    = this.memory.targets.map(Game.getObjectById);

        super.init();
    }
}