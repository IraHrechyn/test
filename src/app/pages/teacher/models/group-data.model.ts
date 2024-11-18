import {StudentData} from "./student-data.model";

export interface GroupData {
  id: number;
  group_name: string,
  teacher_id: number,
  students_id: number[];
}
