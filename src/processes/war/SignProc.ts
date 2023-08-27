import CreepProc from "../CreepProc";

export default class SignProc extends CreepProc
{
    room: Room;

    memory: {
        roomName : string;
        text     : string;

        creepGoal: number;
        creeps?: string[];
        bodyGoal?: BodyPartConstant[];
    };

    handleCreep(creep: Creep): void {
        // if no intel on room move blind
        if (!this.room)
            creep.moveTo(new RoomPosition(25, 25, this.memory.roomName));
        // else sign the controller
        else
            if (creep.signController(this.room.controller, this.memory.text) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.room.controller);
    }

    init(): void {
        if (!this.memory.creepGoal)
            this.memory.creepGoal = 1;
        if (!this.memory.bodyGoal)
            this.memory.bodyGoal = [MOVE];

        this.room = Game.rooms[this.memory.roomName];
        super.init();
    }

    run(): void {
        // if goal is complete
        if (this.room.controller.sign && this.room.controller.sign.text == this.memory.text)
        {
            // kill creeps
            this.memory.creeps.map(x => Game.creeps[x].suicide());
        
            // end proc
            this.kill = true;
        }

        super.run();
    }
}