import Comms            from "../../framework/Comms";
import Process          from "../../framework/Process";
import { SpawnRequest } from "../../interface/SpawnRequest";

export default class SwarmSpawnerProc extends Process
{
    spawners    : StructureSpawn[];

    memory: {
        spawners    : Id<StructureSpawn>[]  // spawners under the control of the proc

        idleCreeps  : string[]              // creeps spawned but unused
        reserve     : number                // the creeps to keep in reserve
    };


    constructor(name, memory)
    {
        super(name, memory);
    }


    // try to spawn a creep at a site
    private trySpawnCreep(spawn: StructureSpawn): boolean
    {
        if (spawn.spawning)
            return;

        let name = `${this.ref}_${Game.time}`;
        if (spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], name) == OK)
        {
            this.memory.idleCreeps.push(name);
            return true;
        }

        return false;
    }


    // handle an incoming spawn request
    handleSpawnRequest(request: SpawnRequest)
    {
        if (this.memory.idleCreeps.length == 0)
            return false;

        // transfer idle creep to the requester
        request.requester.memory['creeps'].push(this.memory.idleCreeps.shift());
        return true;
    }


    // handle an idle creep event
    handleIdleCreep(creep: Creep)
    {
        // add to our set of idle creeps
        this.memory.idleCreeps.push(creep.name);
        return true;
    }


    init(): void {
        // update spawner list
        this.spawners = this.memory.spawners.map<StructureSpawn>(Game.getObjectById);

        if (!this.memory.idleCreeps)
            this.memory.idleCreeps = [];

        if (!this.memory.reserve)
            this.memory.reserve = 1;

        // register events
        Comms.register('spawnRequest', this.handleSpawnRequest.bind(this));
        Comms.register('idleCreep',    this.handleIdleCreep.bind(this));
    }


    run(): void {
        // try to spawn a creep at each spawn until reserve limit is hit
        for (let spawn of this.spawners)
        {
            if (this.memory.idleCreeps.length >= this.memory.reserve)
                break;
            this.trySpawnCreep(spawn);
        }
    }
}