import { sortBy } from "lodash";
import { assignRole } from "../../../funcs/misc";
import { Site } from "../../Site";
import RoleHandler from "./RoleHandler";

export default function(role: string, targetType: string): RoleHandler
{
    return function(creep: Creep) 
    {
        let site    = this as Site;
        let targets = sortBy(site.objects.getContent(targetType), x => creep.pos.getRangeTo(x as any));

        assignRole(creep, role, targets[0].id);
    }
}