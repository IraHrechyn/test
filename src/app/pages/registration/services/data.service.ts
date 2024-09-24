import {Injectable} from "@angular/core";
import {RoleModel} from "../model/role.model";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  role: RoleModel;

  constructor() {
    this.role = new RoleModel();
  }
}
