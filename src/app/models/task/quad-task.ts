import { ITask } from './itask';
import { IQuadTask } from './iquad-task';
import { Quadrant } from './quadrant';

// Task object with added quadrant logic; could be either a parent or child
export class QuadTask implements ITask, IQuadTask {
    public id: string = null;
    public title: string = null;
    public selfLink: string = null;
    public status: string = null;
    public notes: string = null;
    public quadrant: Quadrant = new Quadrant();

    constructor () {
    }
}