import PathingProc, { PathInfo } from "../../processes/PathingProc";
import Processor from "../Processor";

export default class PathDraw
{
    procName    : string;
    pathingProc : PathingProc;

    constructor(pname: string)
    {
        this.procName    = pname;
        this.pathingProc = Memory['processor'].processes[pname]
    }

    drawPath(r: RoomVisual, path: PathInfo)
    {
        let last = path.startPos;
        for (let point of path.path)
        {
            r.line(last.x, last.y, point.x, point.y, { opacity: 0.1 });
            last = point as any;
        }
    }

    draw()
    {
        for (let path of this.pathingProc.memory.paths)
        {
            this.drawPath(new RoomVisual(path.startPos.roomName), path);
            // this.drawPath(new RoomVisual(path.endPos.roomName), path);
        }
    }
}