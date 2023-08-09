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
        if (this.memory.test)
        {
            console.log(this.memory.test);
            this.kill = true;
            return;
        }
        this.memory.test = Game.time;
    }
}