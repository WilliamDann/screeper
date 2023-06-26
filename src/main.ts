import Systems      from "./Core/Systems";
import Values       from "./Core/Values";
import HarvestSite  from "./Systems/Site/HarvestSite";
import SpawnSite    from "./Systems/Site/SpawnSite";
import { LogLevel } from "./LogLevel";

const sites = {
    'SpawnSite'   : SpawnSite,
    'HarvestSite' : HarvestSite
}


function dump()
{
    let sys = Systems.getInstance();

    // save sites
    Memory['sites'] = [];
    Object.keys(sys.siteSystem.sites).forEach(x => {
        Memory['sites'].push({ type: sys.siteSystem.sites[x].constructor.name, obj: sys.siteSystem.sites[x] });
    })
}


function load()
{
    let sys = Systems.getInstance();

    // load saved sites
    for (let site of Memory['sites'])
    {
        let f   = sites[site.type];
        let obj = new f(site.obj.focus);

        Object.assign(obj, site.obj);
        sys.siteSystem.register(obj);
    }
}


// debug setup
function setup()
{
    let sys  = Systems.getInstance();

    if (!Memory['sites'])
    {
        for (let spawn in Game.spawns)
            sys.siteSystem.register(new SpawnSite(Game.spawns[spawn].id));
        for (let name in Game.rooms)
            for (let source of Game.rooms[name].find(FIND_SOURCES))
                sys.siteSystem.register(new HarvestSite(source.id));

        dump();
    }
}


export function loop()
{
    // debug setup
    setup();


    // load info
    load();
    let sys  = Systems.getInstance();
    let vals = Values.getInstance(); 

    vals.logLevel = LogLevel.Warning;


    // emit flow events
    sys.eventSystem.emit('ready',   null);
    sys.eventSystem.emit('tick',    null);
    sys.eventSystem.emit('destroy', null);


    // save state changes
    dump();

    // screeps does not destroy static members, so we must
    Systems.clear();
    Values.clear();
}