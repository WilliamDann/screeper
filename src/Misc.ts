export default interface _HasStore
{
    store: GenericStore;
}

export function findEnergySource(room: Room, minAmount: number = 1, sortPos: RoomPosition=null) {
    let structures = room.find(
        FIND_STRUCTURES, 
        { filter: function(x: _HasStore) {
            x.store.energy >= minAmount
        }}
    );
    let drops   = room.find(FIND_DROPPED_RESOURCES, {filter: x => x.resourceType == RESOURCE_ENERGY && x.amount > minAmount});
    let sources = room.find(FIND_SOURCES, {filter: x => x.energyCapacity >= minAmount});

    let opts = [...structures, ...drops, ...sources]
    if (sortPos)
        opts.sort(x => sortPos.getRangeTo(x.pos));
    return opts[0];
}