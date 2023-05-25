import { filter, sortBy } from "lodash";
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

function findWorkRole(creep: Creep, site: Site)
{
    // Fill containers
    // TODO 
    //  this will be suboptimal for Storages because of their huge capacity
    //  some way to limit will be useful
    let containers = site.objects.getContent('container') as StructureContainer[];
    containers = filter(containers, x => x.store.getFreeCapacity(RESOURCE_ENERGY) != 0);
    if (containers.length != 0)
    {
        containers = sortBy(containers, x => creep.pos.getRangeTo(x));
        assignRole(creep, 'fill', containers[0].id);
        return;
    }

    // Build Sites
    let sites = site.objects.getContent('constructionSite') as ConstructionSite[];
    if (sites.length != 0)
    {
        sites = sortBy(sites, x => creep.pos.getRangeTo(x));
        assignRole(creep, 'build', sites[0].id);
    }

    // Upgrade controllers
    let controllers = site.objects.getContent('controller') as StructureController[];
    controllers = filter(controllers, x=>x.pos.roomName == creep.pos.roomName);
    if (containers.length != 0)
    {
        assignRole(creep, 'upgrade', controllers[0].id);
        return;
    }

    // Sit idle :/
    assignRole(creep, 'idle', null, false);
}

export default (function (creep:Creep) {
    let role = creep.memory['role'];
    let state = creep.memory['state'];

    if (!role || role == 'idle' || !state)
    {
        let fillPercent = creep.store.getUsedCapacity() / creep.store.getCapacity();
        if (fillPercent < 0.25)
            return findCollectRole(creep, this);
        return findWorkRole(creep, this);
    }
})as RoleHandler;