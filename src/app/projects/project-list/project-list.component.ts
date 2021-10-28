import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project, ProjectList } from '../core/models/project.model';
import { ProjectService } from '../core/services/projects.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
export class ProjectListComponent implements OnInit, OnDestroy {
  private _projectList!: ProjectList;
  private _projectListSubscription!: Subscription;

  search = '';

  showProjectForm = false;
  projectToEdit: Project = new Project();

  get projectList(): ProjectList {
    return this._projectList || new ProjectList();
  }

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this._projectListSubscription =
      this.projectService.projectListChanged.subscribe(
        (projectList) => (this._projectList = projectList)
      );

    this.projectService
      .fetchProjects(
        this.projectList.pagination.pageIndex,
        this.projectList.pagination.pageSize
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._projectListSubscription.unsubscribe();
  }

  onPaginate(event: {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }) {
    this.projectService
      .searchProjects(event.page, event.rows, this.search)
      .subscribe();
  }

  applyFilterGlobal($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.projectService
      .searchProjects(
        this.projectList.pagination.pageIndex,
        this.projectList.pagination.pageSize,
        value
      )
      .subscribe();
  }

  onViewProject(project: Project) {
    this.router.navigate([project.id], { relativeTo: this.route });
  }

  onEditProject(project: Project) {
    this.projectToEdit = project;
    this.showProjectForm = true;
  }

  onAddProject() {
    this.projectToEdit = new Project();
    this.showProjectForm = true;
  }

  onDeleteProject(project: Project) {
    if (project.id) {
      this.projectService.deleteProject(project.id).subscribe();
    }
  }
}
