import {Injectable} from "@angular/core";
import {RoleModel} from "../model/role.model";
import {EntranceModel} from "../model/entrance.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  role: RoleModel;
  entrance: EntranceModel;

  constructor() {
    this.role = new RoleModel();
    this.entrance = new EntranceModel();
  }
}
