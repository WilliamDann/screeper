import CreepProc from "./CreepProc";

// handles creeps upgrading a controller
export default class RclProc extends CreepProc
{
    room      : Room;                   // the room to operate in
    controller: StructureController;    // the controller for the room

    memory: {
        goal      : number              // the rcl goal to hit
        room      : string;             // the room to operate in
        creepGoal : number              // the number of creeps to aim for

        creeps    : string[]            // the creeps to upgrade with
    }

    constructor(name, memory)
    {
        super(name, memory);
    }


    // upgrade a controller with creeps
    handleCreep(creep: Creep)
    {
        if (creep.memory['state'])
        {
            // upgrade
            if (creep.upgradeController(this.controller) == ERR_NOT_IN_RANGE)
                creep.moveTo(this.controller);

            // pickup if empty
            if (creep.store.energy == 0)
                creep.memory['state'] = false;
        }
        else
        {
            // find / remember an energy pickup point
            let target;
            if (creep.memory['pickup'])
                target = Game.getObjectById(creep.memory['pickup']);
            if (!target)
                target = creep.room.find(FIND_DROPPED_RESOURCES).sort(x => x.pos.getRangeTo(creep))[0];

            // pickup the energy
            if (creep.pickup(target) == ERR_NOT_IN_RANGE)
                creep.moveTo(target);

            // upgrade if full
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                creep.memory['state'] = true;
        }
    }


    init(): void
    {
        this.room       = Game.rooms[this.memory.room];
        this.controller = this.room.controller;

        super.init();
    }


    run(): void
    {
        // if we hit the goal, kill the proc
        if (this.room.controller.level >= this.memory.goal)
        {
            this.kill = true;
            return;
        }

        super.run();
    }
}