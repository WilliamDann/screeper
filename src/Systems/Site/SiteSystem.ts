import BaseSite from "./BaseSite";

// Site system keeps track of the sites in the world
export default class SiteSystem
{
    sites: BaseSite<_HasId>[];

    constructor()
    {
        this.sites = [];
    }
}