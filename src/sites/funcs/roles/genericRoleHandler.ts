import { Site } from "../../Site";
import RoleHandler from "./RoleHandler";

function findCollectRole(creep:Creep, site: Site) {
    for (let handler of site.energyRequestHandlers)
        if (handler(creep))
            return;
}

function findWorkRole(creep: Creep, site: Site)
{

}

export default (function (creep:Creep) {
    let role = creep.memory['role'];
    if (!role || role == 'idle')
    {
        let fillPercent = creep.store.getUsedCapacity() / creep.store.getCapacity();
        if (fillPercent < 0.25)
            return findCollectRole(creep, this);
        return findWorkRole(creep, this);
    }
})as RoleHandler;