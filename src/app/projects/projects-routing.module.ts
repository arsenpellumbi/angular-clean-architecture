import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/auth/core/guards/auth.guard';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectsComponent } from './projects.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskListComponent } from './task-list/task-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: 'Projects',
    },
    component: ProjectsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ProjectListComponent,
        data: {
          breadcrumb: '',
        },
      },
      {
        path: ':id',
        component: ProjectDetailComponent,
        data: {
          breadcrumb: 'Project',
        },
        children: [
          {
            path: 'tasks',
            component: TaskListComponent,
            data: {
              breadcrumb: 'Tasks',
            },
            children: [
              {
                path: '',
                component: TaskDetailComponent,
                data: {
                  breadcrumb: '',
                },
              },
              {
                path: ':taskId',
                component: TaskDetailComponent,
                data: {
                  breadcrumb: 'Task',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
