import {Role} from "./role.model";

export class  EntranceModel {
  _visible: boolean = false;

  set visibleEntrance(value: boolean) {
    this._visible = value;
  }

  get visibleEntrance(): boolean {
    return this._visible;
  }
}
