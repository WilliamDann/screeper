// spawn request for a creep
export interface SpawnRequest
{
    name: string,
    body: BodyPartConstant[],
    opts: SpawnOptions
}