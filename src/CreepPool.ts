import { Job, JobData } from './Jobs/Job';
import { Runnable }     from "./Runnable";

export class CreepPool
{
    creepsWorking   : string[];
    creepsIdle      : string[];

    constructor()
    {
        this.creepsWorking = [];
        this.creepsIdle    = [];
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

    containsCreep(name: string): boolean
    {
        return this.creepsWorking.indexOf(name) != -1 || this.creepsIdle.indexOf(name) != -1;
    }
}