// Responsible for using creeps to harvest at a given source
import Site from "./Site";

export default class extends Site
{
    constructor(source : Id<Source>)
    {
        super();
        this.addContent("source", source);
    }

    tick()
    {
        let creeps = this.getContent('creep') as Creep[];
        for (let creep of creeps)
            if (!creep.memory['role'])
            {
                creep.memory['role']   = 'harvest';
                creep.memory['target'] = this.getContent("source")[0].id;
            }
    }
}