import Systems from "../../Core/Systems";
import Resources from "../../Objects/Resources";

export default class BaseSite<T extends _HasId>
{
    // The focal point of the site
    //  a HarvestSite would have an Id<Source> for example
    focus       : Id<T>

    // The game objects the site knows about
    //  the creeps under the control of the site, for example
    resources   : Resources;


    // A Site is a location in the world which behavoir is focused around
    //  Harvesting would be run by a HarvestSite and
    //  Spawning would be run by a SpawnSite, for example
    constructor(focus: Id<T>)
    {
        this.focus     = focus;
        this.resources = new Resources();
        

        this.onCreate();
    }


    // called when object is created
    onCreate(): boolean
    {
        Systems.getInstance().eventSystem.register('ready',   this.onReady.bind(this));
        Systems.getInstance().eventSystem.register('tick',    this.onTick.bind(this));
        Systems.getInstance().eventSystem.register('destroy', this.onDestroy.bind(this));

        return false;
    }


    // called when site is ready to be run
    onReady(): boolean
    {
        if (this.resources)
        {
            let tmp = new Resources();
            tmp.data = this.resources.data;
            this.resources = tmp;
        }

        return false;
    }


    // called every game tick
    onTick(): boolean
    {
        return false
    }


    // called when object is destroyed
    onDestroy(): boolean
    {
        return false;
    }
}