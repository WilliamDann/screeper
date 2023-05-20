import SpawnSite from "../sites/SpawnSite";

export default class CreepMediator
{
    private        producers   : SpawnSite[];
    private static instnace    : CreepMediator;

    private constructor()
    {
        this.producers = [];
    }

    public static getInstance()
    {
        if (!CreepMediator.instnace)
            CreepMediator.instnace = new CreepMediator();
        return CreepMediator.instnace;
    }

    public addProducer(spawnSite: SpawnSite)
    {
        this.producers.push(spawnSite);
    }

    public request(body: BodyPartConstant[], name?: string): boolean
    {
        if (!name)
            name = 'Creep_'+Game.time+'_'+Math.floor(Math.random() * 100);

        for (let prod of this.producers)
            if (prod.canSpawn(body, name) == OK)
                return prod.spawn(body, name) == OK;
        return false;
    }
}