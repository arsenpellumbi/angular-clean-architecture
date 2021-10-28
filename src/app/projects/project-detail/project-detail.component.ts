import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { exhaustMap } from 'rxjs/operators';
import { Project } from '../core/models/project.model';
import { ProjectService } from '../core/services/projects.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  showProjectForm = false;
  project: Project = new Project();
  tabItems: MenuItem[] = [];

  get isDetailPathActive() {
    return (
      this.router.routerState.snapshot.url ===
      `/projects/${this.route.snapshot.params.id}`
    );
  }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.isDetailPathActive);

    this.tabItems = [
      {
        label: 'Details',
        icon: 'mdi mdi-text',
        routerLink: ['/projects', this.route.snapshot.params.id],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Tasks',
        icon: 'mdi mdi-calendar',
        routerLink: ['tasks'],
      },
    ];

    this.route.params
      .pipe(
        exhaustMap((params) => {
          const projectId = <string>params.id;
          return this.projectService.getProjectById(projectId);
        })
      )
      .subscribe((project) => {
        this.project = project;
      });
  }

  onEditProject() {
    this.showProjectForm = true;
  }
}
