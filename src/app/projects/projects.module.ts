import { NgModule } from '@angular/core';
import { PrimeNgModule } from '../prime-ng.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProjectsRoutingModule } from './projects-routing.module';

import { ProjectsComponent } from './projects.component';

import { ProjectListComponent } from './project-list/project-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectEditComponent } from './project-edit/project-edit.component';

import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskEditComponent } from './task-edit/task-edit.component';

import { ProjectService } from './core/services/projects.service';
import { DelayedInputDirective } from '../shared/directives/delayed-input.directive';
import { TaskService } from './core/services/tasks.service';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    TaskListComponent,
    TaskDetailComponent,
    TaskEditComponent,
    DelayedInputDirective
  ],
  imports: [CommonModule, ReactiveFormsModule, PrimeNgModule, ProjectsRoutingModule],
  providers: [ProjectService, TaskService]
})
export class ProjectsModule {}
