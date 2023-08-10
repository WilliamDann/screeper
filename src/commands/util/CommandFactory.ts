import Command     from "../Command";
import SeedCommand from "../colonize/SeedCommand";
import HarvestCommand from "../resource/HarvestCommand";
import RefilCommand from "../resource/RefilCommand";

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

        // -- resources --
        case COLOR_YELLOW:
            switch (flag.secondaryColor)
            {
                case COLOR_YELLOW:
                    return new HarvestCommand(flag);
                case COLOR_GREY:
                    return new RefilCommand(flag);
            }
            break;
    }

    return null;
}