import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";

export default (function (creep: Creep): boolean
{
    let containers = this.objects.getContent('container') as StructureContainer[];

    containers = filter(containers, x => x.store.getUsedCapacity(RESOURCE_ENERGY) != 0);
    if (containers.length == 0)
        return false;

    containers = sortBy(containers, x => creep.pos.getRangeTo(x) - (x.store.energy*0.1));
    creep.memory['role']   = 'pull'
    creep.memory['target'] = containers[0].id;
    return true;
}) as EnergyHandler;