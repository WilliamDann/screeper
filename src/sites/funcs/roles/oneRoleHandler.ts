import { sortBy } from "lodash";
import { Site } from "../../Site";
import RoleHandler from "./RoleHandler";

function assignRole(creep: Creep, role:string, target?:string, initalState=true)
{
    creep.memory['role']   = role;
    creep.memory['target'] = target;
    creep.memory['state']  = initalState;
}

function findCollectRole(creep:Creep, site: Site) {
    for (let handler of site.energyRequestHandlers)
        if (handler(creep))
            return;
}

export default function (roleName: string, getTargets: Function)
{
    return (function(creep: Creep) {
        let role = creep.memory['role'];
        let state = creep.memory['state'];

        if (!role || role == 'idle' || !state)
        {
            let fillPercent = creep.store.getUsedCapacity() / creep.store.getCapacity();
            if (fillPercent < 0.25)
                return findCollectRole(creep, this);

            let targets = sortBy(getTargets(this), x => creep.pos.getRangeTo(x));
            if (targets.length == 0)
                return;
            assignRole(creep, roleName, targets[0].id);
        }
    }) as RoleHandler;
}
