import { PaginatedList } from 'src/app/shared/core/models/pagination.model';
import { TaskType } from '../enums/task-type.enum';

export class Task {
  readonly id?: string;
  readonly date: Date | null;
  readonly title: string;
  readonly description: string;
  readonly projectId: string;
  readonly type: TaskType;
  readonly typeLabel: string;

  constructor(id?: string, date?: Date | null, title?: string, description?: string, projectId?: string, type?: TaskType) {
    this.id = id || '';
    this.date = date || null;
    this.title = title || '';
    this.description = description || '';
    this.projectId = projectId || '';
    this.type = type || TaskType.ToDo;
    this.typeLabel = TaskType[this.type];
  }

  public clone(): Task {
    return new Task(this.id, this.date, this.title, this.description, this.projectId, this.type);
  }
}

export class TaskList extends PaginatedList<Task> {}
