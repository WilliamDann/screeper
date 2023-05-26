export default interface SpawnHandler
{
    (name: string, body: BodyPartConstant[], opts: SpawnOptions): boolean;
}