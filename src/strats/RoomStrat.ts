import { Site } from "../sites/Site";

export default interface RoomStrat
{
    (room: Room): Site[];
}