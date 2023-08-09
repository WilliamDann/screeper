import Site from "./sites/Site";

// A colony contains all the commands, processes, and locations the bot is in control of.
export default class Colony
{
    name  : string;     // roomName of the colony
    sites : Site[];     // list of all sites in the colony


    constructor(name: string)
    {
        this.name  = name;
        this.sites = [];
    }


    // call init funcs
    init(): void
    {
        for (let site of this.sites)
            site.init();
    }


    // call run funcs
    run(): void
    {
        for (let site of this.sites)
            site.run();
    }
}