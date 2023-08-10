import RefilProc        from "./processes/logi/RefilProc";
import DropHarvestProc  from "./processes/resource/DropHarvestProc";
import BasicSpawnProc   from "./processes/spawn/BasicSpawnProc";

const procTable = {
    'BasicSpawnProc'  : BasicSpawnProc,
    'DropHarvestProc' : DropHarvestProc,
    'RefilProc'       : RefilProc,
}
export default procTable;