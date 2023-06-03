import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";
import { assignRole } from "../../../funcs/misc";

export default (function (creep: Creep): boolean
{
    let containers = this.objects.getContent('container') as StructureContainer[];
    containers = filter(containers, x => x.store.getUsedCapacity(RESOURCE_ENERGY) != 0);
    containers = sortBy(containers, x => creep.pos.getRangeTo(x) - (x.store.energy*0.1));
    if (containers.length == 0)
        return false;

    assignRole(creep, 'take', containers[0].id);
    return true;
}) as EnergyHandler;