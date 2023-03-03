export interface Runnable
{
    pre?()  : void;
    tick()  : void;
    post?() : void;
}