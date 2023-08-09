import Command     from "../Command";
import SeedCommand from "../colonize/SeedCommand";

export default function commandFactory(flag: Flag): Command
{
    switch (flag.color)
    {
        // -- colonize -- 
        case COLOR_PURPLE:
            switch (flag.secondaryColor)
            {
                case COLOR_GREY:
                    return new SeedCommand(flag);
            }
            break;
    }

    return null;
}