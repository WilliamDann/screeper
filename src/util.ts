import { uniqueId } from "lodash";

// get the free spots around a point
export function freeSpots(pos: RoomPosition)
{
    let area = Game.rooms[pos.roomName].lookForAtArea(
        LOOK_TERRAIN,
        pos.y - 1,
        pos.x - 1,
        pos.y + 1,
        pos.x + 1,
        true
    );
    area = area.filter(x => x.terrain != 'wall');
    return area.length;
}

// get the CPU used by a func
export function time(func : Function): number
{
    let pre = Game.cpu.getUsed();
    func()
    let post = Game.cpu.getUsed();

    return post-pre;
}


// start CPU timer
let timers = {};
export function timerStart(): string
{
    let id = uniqueId();
    timers[id] = Game.cpu.getUsed();
    return id;
}

// stop cpu timer
export function timerStop(uid: string): number
{
    return Game.cpu.getUsed() - timers[uid];
}

// 'clear' the console by printing 25 newlines
export function consoleClear()
{
    for (let i = 0; i < 25; i++)
        console.log();
}
