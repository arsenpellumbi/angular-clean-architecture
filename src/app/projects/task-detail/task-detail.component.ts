import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { TaskType } from '../core/enums/task-type.enum';
import { Task } from '../core/models/task.model';
import { TaskService } from '../core/services/tasks.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  task!: Task;
  showTaskForm = false;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        exhaustMap((params) => {
          if (params.taskId) {
            return this.taskService.getTaskById(params.taskId);
          }
          return of(null);
        })
      )
      .subscribe((task) => {
        if (task) {
          this.task = task;
        }
      });
  }

  onEditTask() {
    this.showTaskForm = true;
  }
}
