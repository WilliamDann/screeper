import Systems           from "../../Core/Systems";
import SpawnRequestEvent from "../Event/Events/SpawnRequestEvent";
import BaseSite          from "./BaseSite";

export default class HarvestSite extends BaseSite<Source>
{
    // the number of harvesting spots at the site
    spots: number;


    // a HarvestSite is a site focused on a source for harvesting materials
    constructor(focus: Id<Source>)
    {
        super(focus);
    }


    // update the spots variable with the spots a creep could stand on around the site
    private updateSpots(): void 
    {
        let source = Game.getObjectById(this.focus);
        let area = source.room.lookForAtArea(
            LOOK_TERRAIN,
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true
        );
        area = area.filter(x => x.terrain != 'wall');
        this.spots = area.length;
    }


    onCreate(): boolean {
        Systems.getInstance().eventSystem.register('EnergyRequest', this.onEnergyRequest.bind(this));

        if (!this.spots)
            this.updateSpots();

        return super.onCreate();
    }


    onTick(): boolean {
        // emit a spawn request if not at creep goal
        let creeps = this.resources.get('creep');
        if (creeps.length < this.spots)
            new SpawnRequestEvent()
                .setName(this.focus+Game.time)
                .setBody([WORK, CARRY, MOVE])
                .setOwner(this.focus)
                .emit()

        return super.onTick();
    }


    // handles requests for energy
    onEnergyRequest(): boolean {


        return false;
    }
}