import CreepProc from "./CreepProc";

// proc for a room that is just getting started
export default class ProtoProc extends CreepProc
{
    room: Room;

    memory: {
        roomName  : string
        creepGoal : number;

        creeps    : string[];
    };

    constructor(name, memory)
    {
        super(name, memory);
    }

    handleHarvest(creep: Creep): void {
        // find a pickup site if needed
        if (!creep.memory['target'])
        {
            let srcs = creep.room.find(FIND_SOURCES)
                .sort(x => creep.pos.getRangeTo(x));
            creep.memory['target'] = srcs[0].id;
        }

        // pickup the resources
        let target = Game.getObjectById(creep.memory['target']) as Source;
        if (creep.harvest(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // new state needed
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            creep.memory['state'] = undefined;
    }

    handlePickup(creep: Creep): void {
        // find a pickup site if needed
        if (!creep.memory['target'])
        {
            let drops = creep.room.find(FIND_DROPPED_RESOURCES)
                .sort(x => -x.pos.getDirectionTo(creep.pos) + (x.amount * 10));

            if (drops.length == 0)
            {
                creep.memory['state'] = 'harvest';
                return;
            }

            creep.memory['target'] = drops[0].id;
        }

        // pickup the resources
        let target = Game.getObjectById(creep.memory['target']) as Resource;
        if (!target)
        {
            delete creep.memory['target'];
            return;
        }
        if (creep.pickup(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
            creep.memory['state'] = undefined;
    }

    handleDropoff(creep: Creep): void {
        // find a dropoff site if needed
        if (!creep.memory['target'])
        {
            let fills = creep.room.find(FIND_STRUCTURES)
                .filter(x => x['store'] && x['store'].getFreeCapacity(RESOURCE_ENERGY) != 0 && !x['moveTo']);

            // if nothing to fill, upgrade
            if (fills.length == 0)
            {
                creep.memory['state'] = 'upgrade';
                return;
            }

            creep.memory['target'] = fills[0].id;
        }

        // pickup the resources
        let target = Game.getObjectById(creep.memory['target']) as StructureContainer;
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            creep.memory['state'] = undefined;
    }

    handleUpgrade(creep: Creep): void {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            creep.moveTo(creep.room.controller);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            creep.memory['state'] = undefined;
    }

    handleCreep(creep: Creep): void {
        creep.say((''+creep.memory['state'])[0]);

        // find role
        if (!creep.memory['state'])
        {
            delete creep.memory['target'];

            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) != 0)
                creep.memory['state'] = 'pickup';
            else
                creep.memory['state'] = 'dropoff';
        }

        let x = {
            'harvest' : this.handleHarvest,
            'pickup'  : this.handlePickup,
            'dropoff' : this.handleDropoff,
            'upgrade' : this.handleUpgrade

        };
        
        x[creep.memory['state']](creep);
    }

    init(): void {
        this.room = Game.rooms[this.memory.roomName];
        super.init();
    }

    run(): void {
        super.run();
    }
}