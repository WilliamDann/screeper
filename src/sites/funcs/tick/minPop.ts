import { Site } from "../../Site";

// Maintain a minimum population
export default function(pop: number)
{
    let site   = this as Site;
    let creeps = site.objects.getContent('creep');
    let danger = site.objects.getContent('danger');

    if (creeps.length < pop && danger.length == 0)
    {
        for (let handler of site.spawnRequestHandlers)
            if (handler(site.identifier, [WORK, CARRY, MOVE, MOVE], ''+site.identifier+Game.time))
                return;
    }
}