import { PaginatedList } from "src/app/shared/core/models/pagination.model";

export class Project {
  readonly id?: string;
  readonly date: Date | null;
  readonly title: string;
  readonly description: string;

  constructor(id?: string, date?: Date | null, title?: string, description?: string) {
    this.id = id || '';
    this.date = date || null;
    this.title = title || '';
    this.description = description || '';
  }

  public clone(): Project {
    return new Project(this.id, this.date, this.title, this.description);
  }
}

export class ProjectList extends PaginatedList<Project> {}
