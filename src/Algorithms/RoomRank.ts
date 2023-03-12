export class RoomRank
{
    w: number;
    h: number;

    mat: [number[]]

    constructor(w=50, h=50)
    {
        this.w = w;
        this.h = h;
        this.init();
    }

    init(starting=-Infinity)
    {
        this.mat = [] as any;
        for (let x = 0; x < this.w; x++)
        {
            let row = [];
            for (let y = 0; y < this.h; y++)
                row.push(-Infinity)
            this.mat.push(row);
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
        for (let x = 0; x < this.w-1; x++)
            for (let y = 0; y < this.h-1; y++)
                if (this.mat[x][y] != -Infinity)
                    this.mat[x][y] -= new RoomPosition(x, y, pos.roomName).findPathTo(pos).length * 10;
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