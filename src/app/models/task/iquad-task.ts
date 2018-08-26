import { ITask } from "./itask";
import { Quadrant } from "./quadrant";

export interface IQuadTask extends ITask {
    quadrant: Quadrant;
}
