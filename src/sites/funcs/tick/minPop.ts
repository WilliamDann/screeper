import NestFactory from "../../../nest/NestFactory";
import { Site } from "../../Site";

// Maintain a minimum population
export default function(pop: number, room: string)
{
    let site   = this as Site;
    let creeps = site.objects.getContent('creep');
    let danger = site.objects.getContent('danger');

    if (creeps.length < pop && danger.length == 0)
    {
        for (let handler of NestFactory.getInstance(room).handlers.spawn)
        {
            let name = `${site.identifier}_${Game.time}`;
            let body = [WORK, CARRY, MOVE, MOVE];
            let opts =  { memory: { owner: site.identifier } };
            if (handler(name, body, opts))
                return;
        }
    }
}