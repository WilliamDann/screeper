import Node     from "./Node" 

export default class SourceNode extends Node<Source>
{
    constructor(objId: Id<Source>)
    {
        super(objId);
    }

    tick(): void 
    {
        console.log(`${this.objId} : ${this.getSeats().length}`)
    }

    // get the spots a creep could mine from
    getSeats(): RoomPosition[]
    {
        const arr = []
        const src = Game.getObjectById(this.objId);
        const area = src.room.lookAtArea(
            src.pos.y - 1,
            src.pos.x - 1,
            src.pos.y + 1,
            src.pos.x + 1,
            false
        );

        for (let x in area)
            for (let y in area[x])
            {
                let hasWall = false;

                for (let item of area[x][y])
                    if (item.terrain == 'wall')
                    {
                        hasWall = true;
                        break;
                    }

                if (!hasWall)
                    arr.push(new RoomPosition(parseInt(x), parseInt(y), src.room.name));
            }

        return arr
    }
}