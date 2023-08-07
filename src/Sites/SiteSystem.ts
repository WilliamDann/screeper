import { Site } from "./Site";

// Store sites in the game world
export default class SiteSystem
{
    // site storage object
    sites: {string : Site};


    constructor()
    {
        this.sites = {} as any;
    }


    // get a site from the system
    getSite(id: Id<_HasId>): Site
    {
        return this.sites[id];
    }


    // add a site to the system
    addSite(site: Site): void
    {
        this.sites[site.focusId] = site;
    }


    // add multiple sites to the system
    addSites(sites: Site[]): void
    {
        for (let site of sites)
            this.addSite(site);
    }
}