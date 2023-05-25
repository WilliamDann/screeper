import SiteContents     from "./SiteContents";

import RoleHandler      from "./funcs/roles/RoleHandler";
import SpawnHandler     from "./funcs/spawn/SpawnHandler";
import EnergyHandler    from "./funcs/energy/EnergyHandler";

export interface Site
{
    identifier : string;
    objects    : SiteContents;
    
    // callbacks
    onTick                : Function[];
    
    // request handlers
    energyRequestHandlers : EnergyHandler[];
    spawnRequestHandlers  : SpawnHandler[];
    creepRoleHandler      : RoleHandler;
}