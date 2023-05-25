import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";

export default (function (creep: Creep): boolean
{
    let sources = this.getContent('source') as Source[];

    sources = filter(sources, x => x.energy != 0);
    if (sources.length == 0)
        return false;

    sources = sortBy(sources, x => creep.pos.getRangeTo(x) - (x.energy*0.1));
    creep.memory['role']   = 'harvest'
    creep.memory['target'] = sources[0].id;
    return true;
}) as EnergyHandler;