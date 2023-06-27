import BaseSite from "../../Objects/Sites/BaseSite";

// Site system keeps track of the sites in the world
export default class SiteSystem
{
    // actual storeage of sites
    //  focus -> Site
    sites: {string: BaseSite<_HasId>};


    constructor()
    {
        this.sites = {} as any;
    }


    // add a site to the system
    register(site: BaseSite<_HasId>)
    {
        this.sites[site.focus] = site;
    }


    // remove a site from the system
    unregister(site: BaseSite<_HasId>)
    {
        if (this.sites[site.focus] != site)
            return;

        this.sites[site.focus] = undefined;
    }
}