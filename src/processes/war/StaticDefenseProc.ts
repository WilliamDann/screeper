import CreepProc from "../CreepProc";

export default class StaticDefenseProc extends CreepProc
{
    room    : Room;
    towers  : StructureTower[];
    targets : (StructureRampart | StructureWall)[]

    memory: {
        roomName    : string;

        wallHits    : number;
        rampartHits : number;
        creepGoal   : number;

        towers      : Id<StructureTower>[];
    }

    findTargets(): (StructureRampart | StructureWall)[]
    {
        return [
            ...this.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_RAMPART && x.hits < this.memory.rampartHits }),
            ...this.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_WALL    && x.hits < this.memory.wallHits    }),
        ].sort((a, b) => a.hits - b.hits) as (StructureRampart | StructureWall)[];
    }

    attackWithTowers(): boolean
    {
        let baddies = this.room.find(FIND_HOSTILE_CREEPS);
        if (baddies.length == 0)
            return false;

        for (let tower of this.towers)
            if (baddies.length == 1)
                tower.attack(baddies[0])
            else
                tower.attack(baddies.shift());

        return true;
    }

    repairWithTowers()
    {
        for (let tower of this.towers)
        if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > 500)
        {
            tower.repair(this.targets.shift());
        }
    }

    handleCreep(creep: Creep): void {
        // get energy
        if (creep.store.energy == 0)
        {
            delete creep.memory['target'];
            if (!creep.memory['storage'])
                creep.memory['storage'] = creep.room.find(FIND_STRUCTURES, { filter: x => x.structureType == STRUCTURE_STORAGE });

            let storage = Game.getObjectById(creep.memory['storage']) as StructureStorage;
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                creep.moveTo(storage);
        }
        // repair
        else
        {
            if (!creep.memory['target'])
            {
                if (this.targets.length == 0)
                    return;
                creep.memory['target'] = this.targets[0].id;
            }

            let target = Game.getObjectById(creep.memory['target']) as StructureWall;
            if (creep.repair(target) == ERR_NOT_IN_RANGE)
                creep.moveTo(target);
        }
    }

    init(): void {
        if (!this.memory.wallHits)
            this.memory.wallHits = 1;
        if (!this.memory.rampartHits)
            this.memory.rampartHits = 1;
        if (!this.memory.creepGoal)
            this.memory.creepGoal = 0;

        this.room    = Game.rooms[this.memory.roomName];
        this.targets = this.findTargets();
        if (!this.memory.towers)
            this.memory.towers = [];
        this.towers  = this.memory.towers.map(Game.getObjectById) as any[];

        super.init();
    }

    run(): void {
        if (!this.attackWithTowers())
            this.repairWithTowers()
        super.run();
    }
}