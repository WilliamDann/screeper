import Handler from "../../Events/Handler";
import BaseSite from "../BaseSite";


// Base site to handle energy requests
export default class EnergySite<T extends _HasId> extends BaseSite<T>
{
    constructor(focus: Id<T>)
    {
        super(focus);
    }


    // hook up handlers
    init(): void
    {
        new Handler('energyRequest', this.handleEnergyRequest.bind(this)).register();
    }


    // energy request handler
    handleEnergyRequest(creep: Id<Creep>): boolean
    {
        return false;
    }
}