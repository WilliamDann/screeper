export class RoomRank
{
    w: number;
    h: number;

    mat: [number[]]

    weights = {

    }

    constructor(w=50, h=50)
    {
        this.w = w;
        this.h = h;
        this.init();
    }

    init(starting=-Infinity)
    {
        let matrix = []
        for (let x = 0; x < this.w; x++)
        {
            let row = [];
            for (let y = 0; y < this.h; y++)
                row.push(-Infinity)
            matrix.push(row);
        }
    }

    applyAround(x, y, f: (x: number) => number, at?: number)
    {
        this.mat[x][y]       = (at) ? at : f(this.mat[x][y]);
        this.mat[x-1][y-1]   = f(this.mat[x-1][y-1]);
        this.mat[x-1][y]     = f(this.mat[x-1][y]  );
        this.mat[x-1][y+1]   = f(this.mat[x-1][y+1]);
        this.mat[x][y+1]     = f(this.mat[x][y+1]  );
        this.mat[x+1][y+1]   = f(this.mat[x+1][y+1]);
        this.mat[x+1][y]     = f(this.mat[x+1][y]  );
        this.mat[x+1][y-1]   = f(this.mat[x+1][y-1]);
        this.mat[x][y-1]     = f(this.mat[x][y-1]  );
    }

    processArea(entries: LookAtResultWithPos[])
    {
        for (let entry of entries)
            this.mat[entry.x][entry.y] = 0;

        for (let entry of entries)
            if (!entry.terrain || entry.terrain != 'plain')
                this.applyAround(entry.x, entry.y, x => x - 10, -Infinity);
    }

    posWeight(pos: RoomPosition)
    {
        for (let x = 0; x < this.w; x++)
            for (let y = 0; y < this.h; y++)
                this.mat[x][y] -= pos.getRangeTo(new RoomPosition(x, y, pos.roomName));
    }

    getBest() : {x: number, y: number}
    {
        let bestScore = -Infinity;
        let bestPos   = null;
        for (let x = 0; x < this.w; x++)
            for (let y = 0; y < this.h; y++)
                if (this.mat[x][y] > bestScore)
                {
                    bestScore = this.mat[x][y];
                    bestPos   = {x: x, y: y}
                }
        return bestPos;
    }
}