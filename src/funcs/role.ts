import NestFactory from "../nest/NestFactory";
import { Site } from "../sites/Site";

export function findCollectRole(creep:Creep, site: Site) {
    for (let handler of NestFactory.getInstance(creep.room.name).handlers.energy)
        if (handler(creep))
            return;
}