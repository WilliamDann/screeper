import NestFactory from "../../../nest/NestFactory";
import { Site } from "../../Site";

// Maintain a minimum population
export default function(room: string)
{
    let site   = this as Site;

    for (let handler of NestFactory.getInstance(room).handlers.spawn)
    {
        let name = `${site.identifier}_${Game.time}`;
        let body = [WORK, CARRY, MOVE, MOVE];
        let opts =  { memory: { owner: site.identifier } };
        if (handler(name, body, opts))
            return;
    }
}