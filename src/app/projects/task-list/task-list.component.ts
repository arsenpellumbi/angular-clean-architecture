import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';
import { TaskList, Task } from '../core/models/task.model';
import { TaskType } from '../core/enums/task-type.enum';
import { ProjectService } from '../core/services/projects.service';
import { TaskService } from '../core/services/tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  private _taskList!: TaskList;
  private _taskListSubscription!: Subscription;

  projectId!: string;
  search = '';

  showTaskForm = false;
  taskToEdit: Task = new Task();

  get taskList(): TaskList {
    return this._taskList || new TaskList();
  }

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this._taskListSubscription = this.taskService.taskListChanged.subscribe(
      (taskList) => (this._taskList = taskList)
    );

    console.log(this.route.snapshot.params);

    this.projectService.project
      .pipe(
        exhaustMap((project) => {
          this.projectId = project.id || '';
          return this.taskService.fetchTasks(
            this.projectId,
            this.taskList.pagination.pageIndex,
            this.taskList.pagination.pageSize
          );
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._taskListSubscription.unsubscribe();
  }

  onPaginate(event: {
    first: number;
    rows: number;
    page: number;
    pageCount: number;
  }) {
    this.taskService
      .searchTasks(this.projectId, event.page, event.rows, this.search)
      .subscribe();
  }

  applyFilterGlobal($event: Event) {
    const value = ($event.target as HTMLInputElement).value;
    this.taskService
      .searchTasks(
        this.projectId,
        this.taskList.pagination.pageIndex,
        this.taskList.pagination.pageSize,
        value
      )
      .subscribe();
  }

  onViewTask(task: Task) {
    this.router.navigate([task.id], { relativeTo: this.route });
  }

  onEditTask(task: Task) {
    this.taskToEdit = task;
    this.showTaskForm = true;
  }

  onAddTask() {
    this.taskToEdit = new Task();
    this.showTaskForm = true;
  }

  onDeleteTask(task: Task) {
    if (task.id) {
      this.taskService.deleteTask(task.id).subscribe();
    }
  }
}
