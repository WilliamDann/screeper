import Content from "./Content";

export interface Site
{
    // the focal point of the site
    focusId : Id<_HasId>;

    // the game content that the site has access to
    content : Content;


    // exec every tick
    tick?(): void;


    // run before every tick()
    init?(): void;
}