import { Site } from "../../Site";

// Maintain a minimum population
export default function(pop: number)
{
    let site   = this as Site;
    let creeps = site.objects.getContent('creep');

    if (creeps.length < pop)
    {
        for (let handler of site.spawnRequestHandlers)
            if (handler(site.identifier, [WORK, CARRY, MOVE], ''+site.identifier+Game.time))
                return;
    }
}