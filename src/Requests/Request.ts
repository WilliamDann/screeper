import Job          from "../Job/Job";
import SpawnRequest from "./SpawnRequest";

export default interface Request
{
    from        : string;
    to         ?: string;
    time       ?: number;
    priority   ?: number;
    limit      ?: number;

    spawnCreeps?: SpawnRequest[];
    creeps     ?: string[];

    work       ?: Job[];
}