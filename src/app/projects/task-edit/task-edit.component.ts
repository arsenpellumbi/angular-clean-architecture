import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { TaskType } from '../core/enums/task-type.enum';
import { Task } from '../core/models/task.model';
import { TaskService } from '../core/services/tasks.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  @Input() projectId!: string;

  @Input() task!: Task;
  @Output() taskChange = new EventEmitter<Task>();

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  taskForm!: FormGroup;

  taskTypeOptions = [
    {
      label: 'To do',
      value: TaskType.ToDo,
    },
    {
      label: 'In progress',
      value: TaskType.InProgress,
    },
    {
      label: 'Completed',
      value: TaskType.Completed,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      type: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.taskForm && changes.visible && this.task?.id) {
      this.taskForm.setValue({
        title: this.task.title,
        description: this.task.description,
        type: this.task.type,
      });
    }
  }

  onSubmit(): void {
    if (this.task.id) {
      this.taskService
        .updateTask({
          ...this.taskForm.value,
          id: this.task.id,
          projectId: this.task.projectId,
        })
        .subscribe((task) => {
          this._close();
          this.taskChange.emit(task);
        });
    } else {
      this.taskService
        .createTask({
          ...this.taskForm.value,
          projectId: this.projectId,
        })
        .subscribe((task) => {
          this._close();
          this.taskChange.emit(task);
        });
    }
  }

  onCancel(): void {
    this._close();
  }

  private _close() {
    this.visibleChange.emit(false);
    this.taskForm.reset();
  }
}
