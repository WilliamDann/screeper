import LL   from "../Structures/LL";
import Node from "./Node";

export interface SpawnRequest
{
    requester   : string;
    body        : BodyPartConstant[];
    name        : string;
    opts       ?: SpawnOptions;
}

export default class SpawnNode implements Node
{
    spawner : Id<StructureSpawn>;
    Q       : LL<SpawnRequest>;

    constructor(spawner: Id<StructureSpawn>)
    {
        this.spawner = spawner;
        this.Q       = new LL<SpawnRequest>();
    }

    tick()
    {
        let spawner = Game.getObjectById(this.spawner);
        let request = this.Q.peek();

        if (!request)
            return;

        let code = spawner.spawnCreep(request.body, request.name, request.opts);
        switch (code)
        {
            case OK:
                this.Q.remove();
                // TODO return to assigned
                break;

            case ERR_NOT_OWNER:
            case ERR_NAME_EXISTS:
            case ERR_INVALID_ARGS:
            case ERR_RCL_NOT_ENOUGH:
                this.Q.remove();
                // TODO tell assign invalid
                break;
        }
    }
}