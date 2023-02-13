import { Agent } from "./Agent";
import { BuildAgent } from "./BuildAgent";
import { HarvestAgent } from "./HarvestAgent";
import { SpawnerAgent } from "./SpawnerAgent";
import { UpgradeAgent } from "./UpgradeAgent";

export class ScalingAgent extends Agent
{
    constructor()
    {
        super();
        this.creepTarget    = 0;
        this.stage          = 0;
    }

    tick()
    {
        let harv = this.controller.findAgentOfType("HarvestAgent") as HarvestAgent;
        let upgr = this.controller.findAgentOfType("UpgradeAgent") as UpgradeAgent;
        let buil = this.controller.findAgentOfType("BuildAgent")   as BuildAgent;
        let spwn = this.controller.findAgentOfType("SpawnerAgent")   as SpawnerAgent;

        if (Game.time % 10 == 0)
            this.log(this.stage);

        switch (this.stage)
        {
            case 0:
                harv.creepTarget = 3;
                upgr.creepTarget = 0;
                buil.creepTarget = 0;
                spwn.creepTarget = 0;

                if (harv.stage == 2)
                {
                    this.stage = 1;
                    this.depo  = harv.depo; 
                }

                break;
            case 1:
                harv.creepTarget = 3;
                upgr.creepTarget = 1;
                buil.creepTarget = 1;
                spwn.creepTarget = 1;

                spwn.stage = 1;

                spwn.depo  = harv.depo; 
                upgr.depo  = harv.depo;
                buil.depo  = harv.depo;

                // TODO what is the next stage?

                break;
        }
    }
}