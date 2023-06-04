import { Site } from "../sites/Site";

export function findSourceSpots(source: Source): number
{
    let area = source.room.lookForAtArea(
        LOOK_TERRAIN,
        source.pos.y - 1,
        source.pos.x - 1,
        source.pos.y + 1,
        source.pos.x + 1,
        true
    );
    area = area.filter(x => x.terrain != 'wall');
    return area.length;
}

export function assignRole(creep: Creep, role:string, target?:string, initalState=true)
{
    creep.memory['role']   = role;
    creep.memory['target'] = target;
    creep.memory['state']  = initalState;
}

export function getFloatingEnergy(site: Site) 
{
    let num = 0;
    for (let item of site.objects.getContent('resource') as Resource[])
        if (item.resourceType == 'energy')
            num += item.amount
    return num;
}