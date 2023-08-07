import Event      from '../../Events/Event';
import EnergySite from "./EnergySite"

// Use creeps to harvest energy from a site and drop it on the ground near the site.
export default class DropHarvestSite extends EnergySite<Source>
{
    focusId   : Id<Source>;
    creepGoal : number;


    constructor(source: Id<Source>)
    {
        super(source);
    }


    // send a spawn request if we're low on creeps
    requestCreepIfLow()
    {
        let creeps = this.content.getContent('creep') as Creep[];

        if (creeps.length < this.creepGoal)
            new Event('spawnRequest', {body: [WORK, CARRY, MOVE], for: this.focusId}).emit();
    }


    // assign the harvest role to our creeps
    assignCreepRoles()
    {
        let creeps = this.content.getContent('creep') as Creep[];

        for (let creep of creeps)
        {
            creep.memory['role']   = 'harvest';
            creep.memory['target'] = this.focusId;
        }
    }


    // run a game tick
    tick(): void
    {
        this.requestCreepIfLow();
        this.assignCreepRoles();
    }
}