import fill     from './fill';
import builder  from "./builder";
import harvest  from "./harvest";
import upgrader from "./upgrader";
import idle     from "./idle";
import pull     from "./pull"
import take     from './take'
import pickup   from './pickup';
import staticHarvest from './staticHarvest';

const roles =
{
    'harvest': harvest,
    'staticHarvest': staticHarvest,
    'upgrade': upgrader,
    'build'  : builder,
    'pickup' : pickup,
    'fill'   : fill,
    'pull'   : pull,
    'take'   : take,
    'idle'   : idle
}

export default roles;