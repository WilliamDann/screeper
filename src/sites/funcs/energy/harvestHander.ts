import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";
import { assignRole } from "../../../funcs/misc";

export default (function (creep: Creep): boolean
{
    let sources = this.objects.getContent('source') as Source[];
    sources = filter(sources, x => x.energy != 0);
    sources = sortBy(sources, x => creep.pos.getRangeTo(x) - (x.energy*0.1));
    if (sources.length == 0)
        return false;

    assignRole(creep, 'harvest', sources[0].id);
    return true;
}) as EnergyHandler;