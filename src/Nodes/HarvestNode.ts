import Node             from "./Node";
import SpawnNode        from "./SpawnNode";
import { typeNearRank } from "../Structures/Searches";
import { RoomRank } from "../Algorithms/RoomRank";

export class ProtoHarvestNode extends Node
{
    spots : number;
    pull  : Id<_HasId>;
    depo  : Id<ConstructionSite>;

    constructor(source: Id<Source>)
    {
        super(source);
        this.pull = source;
        this.depo = null;
    }

    findSpots(): number
    {
        let source = Game.getObjectById(this.tag as Id<Source>);
        let area   = source.room.lookForAtArea(
            LOOK_TERRAIN,
            source.pos.y - 1,
            source.pos.x - 1,
            source.pos.y + 1,
            source.pos.x + 1,
            true
        );
        area = area.filter(x => x.terrain != 'wall');
        return area.length;
    }

    placeContainerSite()
    {
        let source = Game.getObjectById(this.tag as Id<Source>);
        let area   = source.room.lookAtArea(
            source.pos.y - 3,
            source.pos.x - 3,
            source.pos.y + 3,
            source.pos.x + 3,
            true
        );

        let rank = new RoomRank();
        rank.processArea(area);
        rank.posWeight(source.pos);
        let pos = rank.getBest();

        source.room.createConstructionSite(pos.x, pos.y, 'container');
    }

    findContainer(): string
    {
        let src  = Game.getObjectById(this.tag as Id<Source>);
        let area = src.room.lookAtArea(
            src.pos.y - 4,
            src.pos.x - 4,
            src.pos.y + 4,
            src.pos.x + 4,
            true
        ); 

        for (let entry of area)
            if (entry.constructionSite)
                return entry.constructionSite.id;
            else if (entry.structure && entry.structure.structureType == 'container')
                return entry.structure.id;
        
        this.placeContainerSite();
    }

    upgradeNode(container: Id<StructureContainer>)
    {
        globalThis.graph.verts[this.tag] = new HarvestNode(this.tag as Id<Source>, container);
    }

    tick()
    {
        if (!this.spots)
        {
            this.spots = this.findSpots();
            let spawn  = globalThis.graph.rankBfs(this.tag,x => typeNearRank("SpawnNode", this, x)) as SpawnNode;
            spawn.requests[this.tag] = this.spots;
        }

        if (!this.depo)
            this.depo = this.findContainer() as any;

        if (Game.getObjectById(this.depo) instanceof StructureContainer)
            this.upgradeNode(this.depo as any);

        super.tick();
    }
}

export class HarvestNode extends ProtoHarvestNode
{
    constructor(source: Id<Source>, container: Id<StructureContainer>)
    {
        super(source);
        this.pull = container;
    }

    tick()
    {
        super.tick();
    }
}