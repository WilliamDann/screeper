import Process from "../framework/Process";

// spawn request for a creep
export interface SpawnRequest
{
    // concrete creep info
    name: string,
    body: BodyPartConstant[],
    opts: SpawnOptions,

    // request info
    requester: Process
}