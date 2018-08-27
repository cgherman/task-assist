import { ITaskInList } from "./itask-in-list";
import { DataState } from "./data-state.enum";

export interface ITaskInListWithState extends ITaskInList {
  dataState: DataState;
}