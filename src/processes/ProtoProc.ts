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

    // find a place to get energy
    // TODO replace with seperate logistics proc
    findEnergyTarget(creep: Creep)
    {
        // look for storages
        let storage = creep.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_STORAGE })[0] as StructureStorage;
        if (storage.store.energy > 1000)
        {
            creep.memory['state']  = 'withdraw';
            creep.memory['target'] = storage.id;
            return;
        }

        // look for drops
        let drops = creep.room.find(FIND_DROPPED_RESOURCES)
            .sort(x => -x.pos.getRangeTo(creep.pos) + (x.amount * 10));

        // if no drops harvest
        if (drops.length == 0)
        {
            creep.memory['state'] = 'harvest';
            return;
        }

        // otherwise pickup
        creep.memory['target'] = drops[0].id;
    }

    // pick a role for an idle creep
    findCreepState(creep: Creep): void {
        // remove previous role state
        creep.memory = {};

        // if the creep needs energy, pick it up
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
        {
            creep.memory['state'] = 'pickup';
        }
        else
        {
            creep.memory['state'] = 'dropoff';
        }

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
            this.findEnergyTarget(creep);

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
                .filter(x => x['store'] && x['store'].getFreeCapacity(RESOURCE_ENERGY) != 0 && !x['moveTo'] && x['store'].energy < 1000);

            // if nothing to fill, upgrade
            if (fills.length == 0)
            {
                creep.memory['state'] = 'build';
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

    handleBuild(creep: Creep): void {
        // find a dropoff site if needed
        if (!creep.memory['target'])
        {
            let sites = creep.room.find(FIND_CONSTRUCTION_SITES)
                .sort(x => creep.pos.getRangeTo(creep.pos))

            // if nothing to fill, upgrade
            if (sites.length == 0)
            {
                creep.memory['state'] = 'upgrade';
                return;
            }

            creep.memory['target'] = sites[0].id;
        }

        // pickup the resources
        let target = Game.getObjectById(creep.memory['target']) as ConstructionSite;
        if (!target)
        {
            delete creep.memory['state'];
            return;
        }
    
        if (creep.build(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            creep.memory['state'] = undefined; 
    }

    handleUpgrade(creep: Creep): void {
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            creep.moveTo(creep.room.controller);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            creep.memory['state'] = undefined;
    }

    handleWithdraw(creep: Creep): void {
        // pickup the resources
        let target = Game.getObjectById(creep.memory['target']) as StructureContainer;
        if (!target)
        {
            delete creep.memory['target'];
            return;
        }
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            creep.moveTo(target);

        // new state needed
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) != 0)
            creep.memory['state'] = undefined;
    }

    handleCreep(creep: Creep): void {
        creep.say((''+creep.memory['state'])[0]);

        // find role
        if (!creep.memory['state'])
            this.findCreepState(creep);

        let x = {
            'harvest'  : this.handleHarvest.bind(this),
            'pickup'   : this.handlePickup.bind(this),
            'dropoff'  : this.handleDropoff.bind(this),
            'build'    : this.handleBuild.bind(this),
            'upgrade'  : this.handleUpgrade.bind(this),
            'withdraw' : this.handleWithdraw.bind(this)

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