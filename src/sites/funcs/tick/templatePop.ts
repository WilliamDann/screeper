import { bodyCost } from "../../../funcs/misc";
import NestFactory from "../../../nest/NestFactory";
import { Site } from "../../Site";

function addPattern(body: BodyPartConstant[], pattern: BodyPartConstant[], budget: number): BodyPartConstant[]
{
    budget -= bodyCost(body);

    for (let i = 0, j = 0; i < 100; i++)
    {
        budget -= BODYPART_COST[pattern[j]]
        if (budget <= 0)
            break;
        body.push(pattern[j]);
        j++;
        if (j >= pattern.length)
            j = 0;
    }
    return body;
}

// Maintain a minimum population
export default function(pop: number, room: string, bodyInital: BodyPartConstant[], bodyPattern: BodyPartConstant[])
{
    let site   = this as Site;
    let creeps = site.objects.getContent('creep');
    let danger = site.objects.getContent('danger');

    if (creeps.length < pop && danger.length == 0)
    {
        for (let handler of NestFactory.getInstance(room).handlers.spawn)
        {
            let budget = Math.max( 250, 0.5*Game.rooms[room].energyCapacityAvailable, Game.rooms[room].energyAvailable )
            let name = `${site.identifier}_${Game.time}`;
            let body = addPattern(bodyInital, bodyPattern, budget);
            let opts =  { memory: { owner: site.identifier } };
            if (handler(name, body, opts))
                return;
        }
    }
}