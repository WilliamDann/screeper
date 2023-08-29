import { filter, first, sortBy }   from "lodash";
import CreepProc            from "../CreepProc";

// process for a 'company' of war creeps
export default class CompanyProc extends CreepProc
{
    station : RoomPosition;

    memory: {
        station     : RoomPosition;

        creepGoal   : number;
        creeps      ?: string[];
        bodyGoal    ?: BodyPartConstant[];
    };

    // handle attacking behavior
    handleAttack(creep: Creep, target: Creep, mass = false): void {
        let body = creep.body.map(x => x.type);

        // if creep can mele
        if (body.indexOf('attack') != -1)
            creep.attack(target);

        // if creep can range attack
        if (body.indexOf('ranged_attack') != -1)
            // if there's more than one, RMA
            if (mass)
            {
                creep.moveTo(target)
                creep.rangedMassAttack();
            }
            // otherwise just ranged attack
            else
                creep.rangedAttack(target);
    }

    // let the creep heal itself and allies
    handleHealing(creep: Creep)
    {
        // if the creep can heal
        if (creep.body.map(x => x.type).indexOf('heal') != -1)
        {
            // heal lowest creep in range (self included)
            let area = creep.pos.findInRange(FIND_MY_CREEPS, 3);
            area     = area.filter(x => x.hits != x.hitsMax);

            if (area.length != 0)
                creep.rangedHeal(sortBy(area, x => x.hits)[0]);
        }
    }

    // let the creep execute it's orders
    handleOrders(creep: Creep)
    {
        if (creep.pos.roomName != this.station.roomName || creep.pos.getRangeTo(this.station) > 2)
            creep.moveTo(this.station)
    }

    handleRenew(creep: Creep): boolean
    {
        if (creep.memory['state'] == 'renew')
        {
            let spawn: StructureSpawn;
            if (!creep.memory['spawn'])
                spawn = creep.room.find(FIND_MY_SPAWNS)[0];
            if(!spawn)
                return;

            if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE)
                creep.moveTo(spawn);

            if (creep.ticksToLive >= 1450)
            {
                creep.memory['state'] = undefined;
                return false;
            }
            return true;
        }
        return false;
    }

    handleCreep(creep: Creep): void {
        // renew creep
        if (creep.ticksToLive < 500)
            creep.memory['state'] = 'renew';
        if (this.handleRenew(creep))
            return;
        
        // heal self and others in range
        
        // attack the lowest hits target in range
        let baddies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (baddies.length == 0)
            this.handleHealing(creep);

        let inRange = filter(baddies, x => (x as Creep).pos.getRangeTo(creep) <= 3)
        if (inRange.length != 0)
            this.handleAttack(creep, first(sortBy(inRange, x => x.hits)), inRange.length > 1);

        // attack structures in range
        let structs = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3)
        this.handleAttack(creep, first(structs) as any, structs.length > 1);

        // respond to orders
        this.handleOrders(creep);
    }

    init(): void {
        this.station = new RoomPosition(this.memory.station.x, this.memory.station.y, this.memory.station.roomName);

        super.init();
    }

    run(): void {
        super.run();
    }
}