import CreepProc from "../CreepProc";

// Proc for claiming a room
export default class ClaimProc extends CreepProc
{
    targetRoom: Room;

    memory: {
        creepGoal   : number;
        bodyGoal    : BodyPartConstant[];

        roomName    : string;   // the name of the room to claim
    }

    handleCreep(creep: Creep): void {
        if (creep.pos.roomName != this.memory.roomName)
            creep.moveTo(new RoomPosition(25, 25, this.memory.roomName));
        else {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE)
                creep.moveTo(creep.room.controller);
        }
    }

    init(): void {
        // TODO temp
        super.init();

        this.memory.creepGoal = 1;
        this.memory.bodyGoal  = [ WORK, CARRY, MOVE, CLAIM ]

        this.targetRoom = Game.rooms[this.memory.roomName];
    }

    run(): void {
        super.run();

        // remove when done
        if (this.targetRoom && this.targetRoom.controller.my)
            this.kill = true;
    }
}