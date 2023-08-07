import HarvestSite from './HarvestSite';

// Use creeps to harvest energy from a site and drop it on the ground near the site.
export default class DropHarvestSite extends HarvestSite
{
    focusId   : Id<Source>;


    constructor(source: Id<Source>)
    {
        super(source);
    }


    // drop harvest creep behavior
    execCreep(creep: Creep)
    {
        const status = creep.harvest(this.focus);

        if (status == ERR_NOT_IN_RANGE)
            creep.moveTo(this.focus);

        if (status == OK)
            creep.drop(RESOURCE_ENERGY);
    }
}