import fill     from './fill';
import builder  from "./builder";
import harvest  from "./harvest";
import upgrader from "./upgrader";
import idle     from "./idle";
import pull     from "./pull"
import take     from './take'

const roles =
{
    'harvest': harvest,
    'upgrade': upgrader,
    'build'  : builder,
    'fill'   : fill,
    'pull'   : pull,
    'take'   : take,
    'idle'   : idle
}

export default roles;