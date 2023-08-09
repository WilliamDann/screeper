import Processor from "../Processor";
import Process from "./Process";

// test process
export default class TestProc extends Process
{
    memory: {
        test: number;
    }


    constructor(name: string, memory ?: object)
    {
        super('testProc', memory);
    }


    init(): void {

    }


    run(): void {
        console.log(this.memory.test);
        this.memory.test = Game.time;
    }
}
Processor.registerProcessType(TestProc);