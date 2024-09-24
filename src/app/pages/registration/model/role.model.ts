export interface Role {
  id: string;
  name: string;
}

export class RoleModel {
  private _selectedRole: Role | string = "";

  set selectedRole(value: string | Role) {
    this._selectedRole = value;
  }

  get selectedRole(): string | Role {
    return this._selectedRole;
  }
}
