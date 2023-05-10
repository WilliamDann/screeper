import GraphBuilder from "./Graph/GraphBuilder";

export function loop()
{
    let gb = new GraphBuilder();
    gb.room(Game.rooms.sim);

    let graph = gb.build();
    for (let node in graph.nodes)
    {
        graph.nodes[node].tick();
    }
}