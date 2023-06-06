import { filter, sortBy } from "lodash";
import { Site } from "../../Site";
import RoleHandler from "./RoleHandler";
import { assignRole } from "../../../funcs/misc";
import { findCollectRole } from "../../../funcs/role";

let cursor  = 0;

const roles = {
    'fill': (site: Site, creep: Creep) => {
        let containers = [
            ...site.objects.getContent('spawn'),
            ...site.objects.getContent('extension'),
            ...site.objects.getContent('tower'),
            ...site.objects.getContent('container'),
        ] as StructureContainer[];

        containers = filter(containers, x => x.store.getFreeCapacity(RESOURCE_ENERGY) != 0);
        containers = filter(containers, x => x.structureType as any == 'storage' && x.store.energy <= 10_000) as StructureContainer[]
        if (containers.length != 0)
        {
            containers = sortBy(containers, x => creep.pos.getRangeTo(x));
            assignRole(creep, 'fill', containers[0].id);
            return true;
        }

    },

    'build': (site: Site, creep: Creep) => {
        let sites = site.objects.getContent('constructionSite') as ConstructionSite[];
        if (sites.length != 0)
        {
            sites = sortBy(sites, x => creep.pos.getRangeTo(x));
            assignRole(creep, 'build', sites[0].id);
            return true;
        }
    },

    'upgrade': (site: Site, creep: Creep) => {
        let controllers = site.objects.getContent('controller') as StructureController[];
        controllers = filter(controllers, x=>x.pos.roomName == creep.pos.roomName);
        if (controllers.length != 0)
        {
            assignRole(creep, 'upgrade', controllers[0].id);
            return true;
        }
    }
}

function findWorkRole(creep: Creep, site: Site)
{
    let roleKeys = Object.keys(roles);

    for (let i = 0; i < roleKeys.length; i++)
    {
        if (cursor >= roleKeys.length)
            cursor = 0;
        if (roles[roleKeys[cursor++]](site, creep))
            return;
    }

    assignRole(creep, 'idle', null, false);
}

export default (function (creep:Creep, order: string[]) {
    let role = creep.memory['role'];
    let state = creep.memory['state'];
    this.order = order;

    if (!role || role == 'idle' || !state)
    {
        let fillPercent = creep.store.getUsedCapacity() / creep.store.getCapacity();
        if (fillPercent < 0.80)
            return findCollectRole(creep, this);
        return findWorkRole(creep, this);
    }
})as RoleHandler;