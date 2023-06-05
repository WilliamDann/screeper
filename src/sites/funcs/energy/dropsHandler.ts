import { filter, sortBy } from "lodash"
import EnergyHandler from "./EnergyHandler";
import { assignRole } from "../../../funcs/misc";

export default (function (creep: Creep): boolean
{
    let sources = [
        ...this.objects.getContent('energy'),
        ...this.objects.getContent('tombstone'),
        ...this.objects.getContent('ruin')
    ] as Resource[];
    let source  = sources[Math.floor(Math.random()*sources.length)];

    if (sources.length == 0)
        return false;

    assignRole(creep, 'pickup', source.id);
    return true;
}) as EnergyHandler;