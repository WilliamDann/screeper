// interface for functions that handle events
export default interface EventHandler
{
    (event ?: any, ...args) : boolean;
}