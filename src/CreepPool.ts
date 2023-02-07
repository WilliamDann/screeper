import { Job, JobData } from './Jobs/Job';
import { Runnable }     from "./Runnable";

export class CreepPool
{
    creepsWorking   : string[];
    creepsIdle      : string[];

    constructor()
    {
        this.running = [];
        this.queue   = [];
    }

    setCreepIdle(name: string, idle: boolean=true)
    {
        if (idle)
        {
            this.creepsWorking = this.creepsWorking.filter(x => x != name);
            this.creepsIdle.push(name);
            return;
        }
        this.creepsIdle = this.creepsIdle.filter(x => x != name);
        this.creepsWorking.push(name);
    }

    setCreepWorking(name: string, working: boolean=true)
    {
        this.setCreepIdle(name, !working);
    }

    
}