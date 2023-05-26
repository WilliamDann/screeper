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
        {
            let name = `${site.identifier}_${Game.time}`;
            let body = [WORK, CARRY, MOVE, MOVE];
            let opts =  { memory: { owner: site.identifier } };
            if (handler(name, body, opts))
                return;
        }
    }
}