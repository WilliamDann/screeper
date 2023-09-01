import { filter, sortBy } from "lodash";
import Process from "../framework/Process";
import Comms from "../framework/Comms";

export interface PathInfo
{
    startPos : RoomPosition;    // the roomposition where the path starts
    endPos   : RoomPosition;    // the roomposition where the path ends
    path     : PathStep[];      // the actual path
    time     : number
}


export default class PathingProc extends Process
{
    static PATH_REACH  = 6;
    static CREEP_REACH = 6; 
    static EXPIRE_TIME = 100;

    static PATH_ERR : number[] = [ ERR_NOT_OWNER, ERR_NOT_FOUND, ERR_INVALID_ARGS ]

    memory: {
        paths: PathInfo[];
    };

    // handle a creep needing to move
    handleCreepMove(args: any[])
    {
        let creep  = args[0] as Creep;
        let target = args[1] as RoomPosition;
        
        // reset creep path if target is no longer what it was
        if (creep.memory['path'])
        {
            let dist = target.getRangeTo(creep.memory['path'].endPos);
            if (!dist || creep.memory['path'] > 1)
                creep.memory['path'] = undefined;
        }
        

        // if creep is close, just moveTo
        if (creep.pos.getRangeTo(target) <= PathingProc.PATH_REACH)
        {
            creep.moveTo(target);
            return;
        }

        // find a path if needed
        if (!creep.memory['path'])
        {
            // find ends in path reach range
            let ends   = filter(this.memory.paths, x => target.getRangeTo(x.endPos) <= PathingProc.PATH_REACH);
            
            // sort starts by nearest
            let starts = sortBy(ends, x => creep.pos.getRangeTo(x.startPos));
    
            // if path is out of creep reach range or just does not exist moveTo and record new path
            if (starts.length == 0 || starts[0].startPos.getRangeTo(creep) > PathingProc.CREEP_REACH)
            {
                // create new path
                let path             = { startPos: creep.pos, endPos: target, path: creep.pos.findPathTo(target), time: Game.time } as PathInfo;
                
                // remember path
                this.memory.paths.push(path);
                
                // move creep
                creep.memory['path'] = path;
            }

            // otherwise used existing path
            else
            {
                creep.memory['path'] = starts[0];
                starts[0].time = Game.time;
            }
        }

        // move creep along path
        if (creep.memory['path'])
        {
            let code = creep.moveByPath(creep.memory['path'].path);

            if (PathingProc.PATH_ERR.indexOf(code) != -1)
                creep.memory['path'] = undefined;

            creep.say(code+'');
        }
    }

    init(): void {
        Comms.register('creepMove', this.handleCreepMove.bind(this));
    }

    run(): void {
        // filter out old paths
        // filter(this.memory.paths, x => x.time != undefined && Game.time - x.time > PathingProc.EXPIRE_TIME)
    }
}