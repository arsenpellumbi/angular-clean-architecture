import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Project, ProjectList } from '../models/project.model';

interface GetProjectByIdPayloadResult {
  readonly id: string;
  readonly createdDate: Date;
  readonly modifiedDate: Date;
  readonly title: string;
  readonly description: string;
}

interface GetProjectsPayloadResult {
  readonly totalPages: number;
  readonly count: number;
  readonly data: {
    readonly id: string;
    readonly createdDate: Date;
    readonly modifiedDate: Date;
    readonly title: string;
    readonly description: string;
  }[];
}

interface SearchProjectsPayloadResult {
  readonly totalPages: number;
  readonly count: number;
  readonly data: {
    readonly id: string;
    readonly createdDate: Date;
    readonly modifiedDate: Date;
    readonly title: string;
    readonly description: string;
  }[];
}

@Injectable()
export class ProjectService {
  projectListChanged = new Subject<ProjectList>();
  project = new BehaviorSubject<Project>(new Project());

  private projectList: ProjectList = new ProjectList();
  private baseUrl = environment.projectManagerApiEndpoint;

  constructor(private http: HttpClient) {}

  public fetchProjects(pageIndex: number, pageSize: number) {
    return this.http
      .get<GetProjectsPayloadResult>(`${this.baseUrl}/projects`, {
        params: { pageIndex: pageIndex, pageSize: pageSize },
      })
      .pipe(
        map((resData) => {
          return new ProjectList(
            pageIndex,
            pageSize,
            resData.totalPages,
            resData.count,
            resData.data.map(
              (item) =>
                new Project(
                  item.id,
                  item.modifiedDate || item.createdDate,
                  item.title,
                  item.description
                )
            )
          );
        }),
        tap((projectList) => {
          this.projectList = projectList;
          this.projectListChanged.next(this.projectList);
        })
      );
  }

  public searchProjects(
    pageIndex: number,
    pageSize: number,
    searchValue: string
  ) {
    return this.http
      .get<SearchProjectsPayloadResult>(`${this.baseUrl}/projects/search`, {
        params: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          value: searchValue,
        },
      })
      .pipe(
        map((resData) => {
          return new ProjectList(
            pageIndex,
            pageSize,
            resData.totalPages,
            resData.count,
            resData.data.map(
              (item) =>
                new Project(
                  item.id,
                  item.modifiedDate || item.createdDate,
                  item.title,
                  item.description
                )
            )
          );
        }),
        tap((projectList) => {
          this.projectList = projectList;
          this.projectListChanged.next(this.projectList);
        })
      );
  }

  public getProjectById(projectId: string) {
    return this.http
      .get<GetProjectByIdPayloadResult>(`${this.baseUrl}/projects/${projectId}`)
      .pipe(
        map((resData) => {
          return new Project(
            resData.id,
            resData.modifiedDate || resData.createdDate,
            resData.title,
            resData.description
          );
        }),
        tap((project) => {
          this.project.next(project);
        })
      );
  }

  public createProject(payload: { title: string; description: string }) {
    return this.http.post<string>(`${this.baseUrl}/projects`, payload).pipe(
      map((projectId) => {
        return new Project(
          projectId,
          new Date(),
          payload.title,
          payload.description
        );
      }),
      tap((project) => {
        this.projectList.addItem(project);
        this.projectListChanged.next(this.projectList);
      })
    );
  }

  public updateProject(payload: {
    id: string;
    title: string;
    description: string;
  }) {
    return this.http.put(`${this.baseUrl}/projects`, payload).pipe(
      map(() => {
        return new Project(
          payload.id,
          new Date(),
          payload.title,
          payload.description
        );
      }),
      tap((project) => {
        const oldProject = this.projectList.rows.find(
          (r) => r.id === project.id
        );
        if (oldProject) {
          this.projectList.updateItem(oldProject, project);
          this.projectListChanged.next(this.projectList);
        }
      })
    );
  }

  public deleteProject(projectId: string) {
    return this.http.delete(`${this.baseUrl}/projects/${projectId}`).pipe(
      tap(() => {
        const oldProject = this.projectList.rows.find(
          (r) => r.id === projectId
        );
        if (oldProject) {
          this.projectList.removeItem(oldProject);
        }
      })
    );
  }
}
