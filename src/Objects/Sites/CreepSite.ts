import BaseSite from "./BaseSite";

export default class CreepSite extends BaseSite<Creep>
{


    constructor(id: Id<Creep>)
    {
        super(id);
    }


    onReady(): boolean {
        return super.onReady();
    }


    onTick(): boolean {
        return super.onTick();
    }
}