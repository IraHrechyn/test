export interface TestData {
  id: number;
  subject_id: number;
  test_name: string;
  open_date: string;
  close_date: string;
  open_time: { hours: number, minutes: number };
  close_time: { hours: number, minutes: number };
  questions: Question[];
  duration: { hours: number, minutes: number };
  max_attempts: number;
}


export interface Question {
  id: number;
  question_text: string;
  options: string[] | null;
  correct_answer: string | null;
  type: 'single' | 'multiple' | 'open';
}
