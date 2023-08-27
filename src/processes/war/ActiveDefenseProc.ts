import { filter, last, sortBy } from "lodash";
import CreepProc from "../CreepProc";

export default class ActiveDefenseProc extends CreepProc
{
    room     : Room;
    ramparts : StructureRampart[];
    baddies  : Creep[];

    memory: {
        roomName : string;
        ramparts : Id<StructureRampart>[];

        creepGoal   : number;
        creeps?     : string[];
        bodyGoal?   : BodyPartConstant[];
    };

    handleCreep(creep: Creep): void {
        // find rampart
        if (!creep.memory['post'])
        {
            let posts = filter(this.ramparts, x => (x as StructureRampart).pos.lookFor(LOOK_CREEPS).length == 0);
            let post  = last(sortBy(posts, x => x.pos.getRangeTo(creep)));
            creep.memory['post'] = post.id;
        }

        // move to assigned rampart
        let post = Game.getObjectById(creep.memory['post']) as StructureRampart;
        if (creep.pos.getRangeTo(post) >= 1)
            creep.moveTo(post);

        // try to shoot baddie
        for (let baddie of this.baddies)
            if (creep.pos.getRangeTo(baddie) <= 4)
                creep.rangedAttack(baddie);
    }

    init(): void {
        if (!this.memory.creepGoal)
            this.memory.creepGoal = this.memory.ramparts.length;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal  = [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE] 
    
        this.room     = Game.rooms[this.memory.roomName];
        this.ramparts = this.memory.ramparts.map(Game.getObjectById) as any[];
        this.baddies  = this.room.find(FIND_HOSTILE_CREEPS);

        if (this.baddies.length != 0)
            this.memory.creepGoal = this.ramparts.length;
        else
            this.memory.creepGoal = 0;

        super.init();
    }
}