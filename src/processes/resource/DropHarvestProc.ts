// import { first }                from "lodash";
// import HarvestCommand           from "../../commands/resource/HarvestCommand";
// import Process, { ProcessInit } from "../Process";

// // harvests from sources and drops the material on the ground
// export default class DropHarvestProc extends Process
// {
//     source       : Source;

//     miners       : Creep[];
//     minersNeeded : number;


//     constructor(command: HarvestCommand)
//     {
//         super(command as ProcessInit, 'mine');
//         this.populate();
//     }


//     // get the free spots around the site
//     private getFreeSpots(): number
//     {
//         let area = this.source.room.lookForAtArea(
//             LOOK_TERRAIN,
//             this.source.pos.y - 1,
//             this.source.pos.x - 1,
//             this.source.pos.y + 1,
//             this.source.pos.x + 1,
//             true
//         );
//         area = area.filter(x => x.terrain != 'wall');
//         return area.length;
//     }


//     // populate values with nearby game objects
//     private populate(): void
//     {
//         this.source       = first(this.pos.lookFor(LOOK_SOURCES));
//         this.minersNeeded = this.getFreeSpots(); 

//         // TODO overmind uses math based on the energy needed for minersNeeded
//         //  looking into this may be useful
//     }


//     // handle miner creep
//     private handleMiner(creep: Creep): void
//     {
//         creep.say('miner!');
//     }


//     init(): void
//     {

//     }


//     run(): void
//     {
//         for (let creep of this.miners)
//             this.handleMiner(creep);
//     }
// }