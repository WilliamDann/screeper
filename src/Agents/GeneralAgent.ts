import { Agent }                        from "./Agent";

export class GeneralAgent extends Agent
{
    constructor(spawn: string)
    {
        super();
        this.depo = spawn;
    }

    tick()
    {
        super.tick();
    }
}