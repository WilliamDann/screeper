import SiteContents from "./SiteContents";
import RoleHandler  from "./funcs/roles/RoleHandler";

export interface Site
{
    identifier : string;
    objects    : SiteContents;

    // callbacks
    onTick      : Function[];
    roleHandler : RoleHandler; 
}