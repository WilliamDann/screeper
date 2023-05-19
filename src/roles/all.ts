import { fill } from "lodash";
import builder from "./builder";
import harvest from "./harvest";
import upgrader from "./upgrader";
import idle from "./idle";

const roles =
{
    'harvest': harvest,
    'upgrade': upgrader,
    'build'  : builder,
    'fill'   : fill,
    'idle'   : idle
}

export default roles;