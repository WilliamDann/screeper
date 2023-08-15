# Another Screeps Bot
This is a bot to play the programming MMORTS [Screeps](https://screeps.com/). I never finish these projects - but I am going to try! 

## Setup
Please see [Setup.md](/md/setup.md) for instructions on project setup and installation. These instructions come from by [Screeps Base Repo](https://github.com/WilliamDann/screeps_base) and work here just the same.

## The Framework
The idea was to organize the behaviors of the bot into the two sections listed below.
1. Processes
2. Commands
3. Events

The idea is to loosely resemble a computer, where there are different processes running with their own memory doing their own things. These processes can communicate via an event system, but should generally have no knowledge of each other.

### Processes
A process is something that the bot *does*. Things like keeping track of spawners, harvesting a source, spawning creeps, etc. would fall into a processes.

#### Example Process
This is an example of a process that prints out last tick's Game.time value:

```typescript
// this proc will console.log the last tick's game time
import Process from "../framework/Process";

export default class LateClockProc extends Process
{
    memory: {
        time: number;   // the time of the current tick
    }


    constructor(name, memory)
    {
        super(name, memory);
    }


    // ran before any run() method
    init(): void {
        if (!this.memory.time)
            this.memory.time = 0;
    }


    // run once every game tick
    run(): void {
        console.log(this.memory.time);
        this.memory.time = Game.time;
    }
}
```

The Processor will take these, call their init() and run() functions, and store their memory for later use To see how these processes are added to the processor, see the Commands section below.

**Note:** You can only store JSON serializable data in process memory, as it uses the the in-game memory to store the values.

#### Process Config
If you tried to create this process you will notice an error like **Invalid Process Type**. This is because you need to register the new process type in `Init.ts`. For example:

```typescript
// init.ts
import {addCommand, addProcess} from "./framework/_Init";
import LateClockProc            from "./processes/LateClockProc";

export default function setup()
{
    // adds the process type so the Processor can recreate it from it's procType
    addProcess('LateClockProc', LateClockProc);
}
```

### Commands
A Command is an instruction to the bot to alter it's behavior in some way. These commands are issued via the creation of flags in game.

#### Example Command
```typescript
import Command          from "../framework/Command";
import LateClockProc    from "../processes/harvest/DropHarvestProc";

// command for starting a LateClockProc
export default class LateClockCmd extends Command
{
    constructor(flag: Flag)
    {
        super(flag);
    }


    init(): void
    {
    }


    run(): void
    {
        // add a new LateClockProc to the processor
        this.createProcess(new LateClockProc(
            this.flag.room,
            { tick: Game.time - 1 }
        ));

        // consume the command (removed the flag in-game)
        this.remove();
    }
}
```

This code will be called when there is a flag of the correct colors placed in-game (see config below). This is the easiest way to get processes running: by using a command to start them.

#### Command Config

Configuring commands is very similar to how processes were configured above.

```typescript
// Init.ts
import {addCommand, addProcess} from "./framework/_Init";
import LateProcCmd              from "./commands/LateClockCmd"
import LateClockProc            from "./processes/LateClockProc";

export default function setup()
{
    // add commands
    addCommand(COLOR_WHITE, COLOR_WHITE, LateProcCmd);

    // add processes
    addProcess('LateClockProc', LateClockProc);
}
```

The first two args of addCommand are a screeps ColorConstant that correspond with the desired flag colors for the command. The third arg is the class for that command, in our case LateProcCmd. The Processor will create the Command for you based on the flag config.

### Events
Events are pretty simple in the bot. There is a 'singleton' class called Comms that you can register event listeners to. For example:

```typescript
// SpawnerProc.ts
import Process from "../framework/Process";
import Comms   from "../framework/Comms";

export default class SpawnerProc extends Process
{
    memory: {
        spawner: Id<StructureSpawn> // the spawner
    }


    constructor(name, memory)
    {
        super(name, memory);
    }


    // handles events passed through the Comms event system
    handleSpawnEvent(spawnData: any)
    {
        if (Game.getObjectById(this.memory.spawner).spawnCreep(...spawnData) == OK)
            return true; // consume the event, stoping other listners from seeing it

        return false; // pass the event along to the next listner
    }


    init(): void {
        Comms.register('spawnEvent', this.handleSpawnEvent.bind(this));
    }


    run(): void {

    }
}
```


```typescript
// SpawneeProc.ts
import Process from "../framework/Process";
import Comms   from "../framework/Comms";

export default class SpawneeProc extends Process
{
    memory: {
        creeps : string[] // contains creeps
        goal   : number   // the number of creeps to spawn
    }


    constructor(name, memory)
    {
        super(name, memory);
    }


    init(): void {
        if (!this.memory.creeps)
            this.memory.creeps = [];
    }


    run(): void {
        if (this.memory.creeps.length < this.memory.goal)
            Comms.emit('spawnEvent', { /* spawn data */ })
    }
}
```

The `SpawnerProc.ts` and `SpawneeProc.ts` communicate using the event system without ever needing to know about each other. This means you could have multiple spawn processes and multiple types of spawn processes without needing to change any of the processes that depend on them.

## The Bot
I am still working on getting the actual *bot* part of this working. The framework is cool but it does not do anything in-game, it's just structure. 

Info on this will be posted here when it exists.