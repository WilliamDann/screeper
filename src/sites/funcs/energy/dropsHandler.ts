import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";
import { assignRole } from "../../../funcs/misc";

export default (function (creep: Creep): boolean
{
    let sources = this.objects.getContent('energy') as Resource[];
    sources     = filter(sources, x => x.amount && (x.amount - creep.pos.getRangeTo(x)) != 0);
    sources     = sortBy(sources, x => creep.pos.getRangeTo(x) - (x.amount*0.1));

    if (sources.length == 0)
        return false;

    assignRole(creep, 'pickup', sources[0].id);
    return true;
}) as EnergyHandler;