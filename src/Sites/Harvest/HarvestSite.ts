import Event from "../../Events/Event";
import BaseSite from "../BaseSite";

// Base class for harvesting behavoir
export default class HarvestSite extends BaseSite<Source>
{
    // the number of harvesters allowed
    harvesters: number;


    constructor(source: Id<Source>)
    {
        super(source);
    }


    // the creep behavior at the site
    execCreep(creep: Creep): void
    {
        creep.say("Base HarvestSite");
    }


    // run the creeps in the site's purview
    execCreeps(): void
    {
        for (let creep of this.content.getContent('creep') as Creep[])
            this.execCreep(creep);
    }


    // send a spawn request if we're low on creeps
    spawnHarvesterIfLow(): void
    {
        let creeps = this.content.getContent('creep') as Creep[];

        if (creeps.length < this.harvesters)
            new Event('spawnRequest', {body: [WORK, CARRY, MOVE], for: this.focusId}).emit();
    }


    // game tick
    tick(): void {
        this.spawnHarvesterIfLow();
        this.execCreeps();
    }
}