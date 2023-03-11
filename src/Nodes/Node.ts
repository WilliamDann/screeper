import Job from "../Job/Job";

export default class Node
{
    jobs    : Job[];
    creeps  : string[];
    tag     : string;

    constructor(tag: string)
    {
        this.tag    = tag;
        this.creeps = [];
    }

    tick()
    {

    }

    log(message: any)
    {
        console.log(`${this.constructor.name}(${this.tag}) : ${message}`);
    }
}