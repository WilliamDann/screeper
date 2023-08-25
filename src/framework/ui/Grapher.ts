interface GrapherData {
    data  : Function;
    scale : Function;
    color : string;
}

export default class Grapher {
    static DISP_NUM = 23;

    x        : number;
    y        : number;
    
    funcs : {[name: string]: GrapherData};
    data  : {[name: string]: any[]};

    constructor(x: number, y: number)
    {
        this.x        = x;
        this.y        = y;

        this.funcs    = {} as any;
        this.data     = {} as any;

        if (!Memory['grapher'])
            Memory['grapher'] = {};
        else
            this.data = Memory['grapher'];
    }

    addLine(name: string, data: GrapherData)
    {
        if (!this.data[name])
            this.data[name] = [];
        this.funcs[name] = data;
    }

    collect()
    {
        for (let name in this.funcs)
        {
            this.data[name].push(this.funcs[name].data());
            if (this.data[name].length > Grapher.DISP_NUM)
                this.data[name].shift();
        }

        Memory['grapher'] = this.data;
    }

    drawData(v: RoomVisual, name: string)
    {
        let points = this.data[name];
        let x      = 1;
        let last   = points[0];
        let scale  = this.funcs[name].scale;

        for (let point of points)
        {
            v.line(this.x+x-1, this.y+6+scale(last), this.x+x, this.y+6+scale(point), { color: this.funcs[name].color });
            last = point;
            x++;
        }

        v.text(name + '(' + last.toFixed(2) + ')', this.x+x, this.y+5+scale(last), { align: "right", opacity: 0.3, color: this.funcs[name].color });
    }

    draw()
    {
        const DEFAULT_TEXT = {align: "left", opacity: 0.2 } as MapTextStyle;
        const BOLD_TEXT    = {align: "left", opacity: 0.4 } as MapTextStyle;

        let v = new RoomVisual();
        v.rect(this.x, this.y, Grapher.DISP_NUM+2, 15, { opacity: 0.1 });
        v.text("Grapher", this.x+1, this.y+1, BOLD_TEXT);

        // draw the lines
        for (let name in this.funcs)
            this.drawData(v, name);
    }
}