import Core             from "../Core";
import DropHarvestSite  from "../Sites/Energy/DropHarvestSite";
import FIFOSpawn        from "../Sites/Spawn/FIFOSpawn";

// get the number of empty spaces around the focus
function harvestSpots(source: Source): number
{
    if (this.memory['spots'])
        return this.memory['spots'];

    // count free squares around the source
    let area   = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
    );
    area = area.filter(x => x.terrain != 'wall');

    // store and return spots
    this.memory['spots'] = area.length;
    return area.length;
}

// load in the sim room for debugging in the simulator
export default function(room: Room): void
{
    // debug load sites
    let ss = Core.getInstance().siteSystem;

    // add spawn
    let spawn = new FIFOSpawn(Game.spawns['Spawn1'].id)
    ss.addSite(spawn);

    // add sources
    for (let source of spawn.focus.room.find(FIND_SOURCES))
    {
        let dhs       = new DropHarvestSite(source.id);
        dhs.creepGoal = harvestSpots(source);
    }

    // add creeps to their sites
    for (let name in Game.creeps)
    {
        let creep = Game.creeps[name];
        if (creep.memory['for'])
            ss.getSite(creep.memory['for']).content.addContent('creep', creep.id);
    }
}