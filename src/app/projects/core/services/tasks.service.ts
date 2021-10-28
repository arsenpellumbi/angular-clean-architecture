import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Task, TaskList } from '../models/task.model';
import { TaskType } from '../enums/task-type.enum';

interface GetTaskByIdPayloadResult {
  readonly id: string;
  readonly createdDate: Date;
  readonly modifiedDate: Date;
  readonly title: string;
  readonly description: string;
  readonly projectId: string;
  readonly type: TaskType;
}

interface GetTasksByProjectIdPayloadResult {
  readonly totalPages: number;
  readonly count: number;
  readonly data: {
    readonly id: string;
    readonly createdDate: Date;
    readonly modifiedDate: Date;
    readonly title: string;
    readonly description: string;
    readonly projectId: string;
    readonly type: TaskType;
  }[];
}

interface SearchTasksInProjectPayloadResult {
  readonly totalPages: number;
  readonly count: number;
  readonly data: {
    readonly id: string;
    readonly createdDate: Date;
    readonly modifiedDate: Date;
    readonly title: string;
    readonly description: string;
    readonly projectId: string;
    readonly type: TaskType;
  }[];
}

@Injectable()
export class TaskService {
  taskListChanged = new Subject<TaskList>();
  task = new BehaviorSubject<Task>(new Task());

  private taskList: TaskList = new TaskList();
  private baseUrl = environment.projectManagerApiEndpoint;

  constructor(private http: HttpClient) {}

  public fetchTasks(projectId: string, pageIndex: number, pageSize: number) {
    return this.http
      .get<GetTasksByProjectIdPayloadResult>(`${this.baseUrl}/projects/tasks`, {
        params: {
          projectId: projectId,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
      })
      .pipe(
        map((resData) => {
          return new TaskList(
            pageIndex,
            pageSize,
            resData.totalPages,
            resData.count,
            resData.data.map(
              (item) =>
                new Task(
                  item.id,
                  item.modifiedDate || item.createdDate,
                  item.title,
                  item.description,
                  item.projectId,
                  item.type
                )
            )
          );
        }),
        tap((taskList) => {
          this.taskList = taskList;
          this.taskListChanged.next(this.taskList);
        })
      );
  }

  public searchTasks(
    projectId: string,
    pageIndex: number,
    pageSize: number,
    searchValue: string
  ) {
    return this.http
      .get<SearchTasksInProjectPayloadResult>(
        `${this.baseUrl}/projects/tasks/search`,
        {
          params: {
            projectId: projectId,
            pageIndex: pageIndex,
            pageSize: pageSize,
            value: searchValue,
          },
        }
      )
      .pipe(
        map((resData) => {
          return new TaskList(
            pageIndex,
            pageSize,
            resData.totalPages,
            resData.count,
            resData.data.map(
              (item) =>
                new Task(
                  item.id,
                  item.modifiedDate || item.createdDate,
                  item.title,
                  item.description,
                  item.projectId,
                  item.type
                )
            )
          );
        }),
        tap((taskList) => {
          this.taskList = taskList;
          this.taskListChanged.next(this.taskList);
        })
      );
  }

  public getTaskById(taskId: string) {
    return this.http
      .get<GetTaskByIdPayloadResult>(`${this.baseUrl}/projects/tasks/${taskId}`)
      .pipe(
        map((resData) => {
          return new Task(
            resData.id,
            resData.modifiedDate || resData.createdDate,
            resData.title,
            resData.description,
            resData.projectId,
            resData.type
          );
        }),
        tap((task) => {
          this.task.next(task);
        })
      );
  }

  public createTask(payload: {
    projectId: string;
    title: string;
    description: string;
    type: TaskType;
  }) {
    return this.http
      .post<string>(`${this.baseUrl}/projects/tasks`, payload)
      .pipe(
        map((taskId) => {
          return new Task(
            taskId,
            new Date(),
            payload.title,
            payload.description,
            payload.projectId,
            payload.type
          );
        }),
        tap((task) => {
          this.taskList.addItem(task);
          this.taskListChanged.next(this.taskList);
        })
      );
  }

  public updateTask(payload: {
    id: string;
    title: string;
    description: string;
    type: TaskType;
    projectId: string;
  }) {
    return this.http.put(`${this.baseUrl}/projects/tasks`, payload).pipe(
      map(() => {
        return new Task(
          payload.id,
          new Date(),
          payload.title,
          payload.description,
          payload.projectId,
          payload.type
        );
      }),
      tap((task) => {
        const oldTask = this.taskList.rows.find((r) => r.id === task.id);
        if (oldTask) {
          this.taskList.updateItem(oldTask, task);
          this.taskListChanged.next(this.taskList);
        }
      })
    );
  }

  public deleteTask(taskId: string) {
    return this.http.delete(`${this.baseUrl}/projects/tasks/${taskId}`).pipe(
      tap(() => {
        const oldTask = this.taskList.rows.find((r) => r.id === taskId);
        if (oldTask) {
          this.taskList.removeItem(oldTask);
        }
      })
    );
  }
}
