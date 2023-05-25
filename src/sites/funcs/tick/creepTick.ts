import { Site } from "../../Site";

// Maintain a minimum population
export default function()
{
    let site    = this as Site;
    let creeps  = site.objects.getContent('creep') as Creep[];

    creeps.forEach(creep => site.creepRoleHandler(creep))
}