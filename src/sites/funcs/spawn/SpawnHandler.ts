export default interface SpawnHandler
{
    (requester: string, body: BodyPartConstant[], name?: string): boolean;
}