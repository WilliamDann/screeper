import { filter, sortBy } from "lodash";
import NestFactory from "../../../nest/NestFactory";
import { Site } from "../../Site";
import { assignRole, bodyCost } from "../../../funcs/misc";

function findWithRole(site:Site, role: string) 
{
    return filter(site.objects.getContent('creep') as Creep[], x => x.memory['role'] == role)
}

// Maintain a minimum population
export default function(pop: number, interval: number = 1, kill: boolean = false)
{
    let site   = this as Site;
    let creeps = site.objects.getContent('creep') as Creep[];

    if (creeps.length > pop && findWithRole(site, 'recycle').length < interval)
    {
        let leastValue  =sortBy(creeps, x => x.body.reduce((prev, curr) => prev + BODYPART_COST[curr.type], 0))[0]
        if (!kill)
            assignRole(leastValue, 'recycle', site.objects.getContent('spawn')[0].id)
        else
            leastValue.suicide();
    }
}