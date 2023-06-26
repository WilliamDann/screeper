import Systems from "../../Core/Systems";

export default class BaseSite<T extends _HasId>
{
    focus: Id<T>

    constructor(focus: Id<T>)
    {
        this.focus = focus;

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