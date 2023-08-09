import { CommandCreateOpts } from "./CommandCreateOpts";
import { randomHex }         from "../utils/util";
import { filter }            from "lodash";
import Colony                from "../Colony";
import World                 from "../World";

// A command is an instruction to the bot
export default abstract class Command
{
    // command info
    static commandName : string;            // the text name of the command, such as "colonize"

    // flag for the command
    static flagColorA  : ColorConstant;     // flag color
    static flagColorB  : ColorConstant;     // flag secondaryColor


    // concrete command info
    name                : string;           // the name of the flag
    pos                 : RoomPosition;     // the position of the flag
    room                : Room | null;      // the room of the flag
    colony              : Colony;           // the colony the command is executing in


    constructor(flag: Flag)
    {
        this.name   = flag.name;
        this.pos    = flag.pos;
        this.room   = flag.room;
        this.colony = World.getInstance().colonies[this.room.name];
    }


    // initilizaiton logic
    abstract init(): void;


    // runtime logic
    abstract run(): void;


    // spawn processes for the command
    abstract spawnProcesses(): void;


    // create the game world flag for the command
    static createFlag(pos: RoomPosition, opts: CommandCreateOpts): number | string
    {
        // resolve flag name
        let flagName = opts.name || undefined;
        if (!flagName)
        {
            flagName = randomHex(8);
            if (Game.flags[flagName])
                return ERR_NAME_EXISTS;
        }

        // log creation
        if (!opts.quiet)
        {
            // TODO logging module
            console.log(`Creating command: ${this.commandName} @ ${pos.x},${pos.y}`);
        }

        // create flag
        const result = pos.createFlag(flagName, this.flagColorA, this.flagColorB);
        if (result == flagName && opts.memory)
        {
            Memory.flags[flagName] = opts.memory;
        }

        return result;
    }


    // if a given flag is for this command
    static flagIsMatch(flag: Flag): boolean
    {
        return flag.color == this.flagColorA && flag.secondaryColor == this.flagColorB;
    }


    // if a command flag is present in a given room
    static presentInRoom(pos: RoomPosition): boolean
    {
        return filter(
            Game.rooms[pos.roomName].find(FIND_FLAGS), 
            this.flagIsMatch
        ).length > 0
    }


    // if a command flag is present at a given position
    static presentAtPos(pos: RoomPosition): boolean
    {
        return filter(
            pos.lookFor(LOOK_FLAGS),
            this.flagIsMatch
        ).length > 0
    }


    // if a command flag exists given a scope
    static present(pos: RoomPosition, scope: "room"|"pos"): boolean
    {
        if (scope == "room")
            return this.presentInRoom(pos);
        return this.presentAtPos(pos);
    }


    // remove the command by removing it's flag
    remove()
    {
        for (let flag of this.pos.lookFor(LOOK_FLAGS))
            flag.remove();
    }
}