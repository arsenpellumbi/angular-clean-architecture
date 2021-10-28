import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../core/models/project.model';
import { ProjectService } from '../core/services/projects.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit, OnChanges {
  @Input() project!: Project;
  @Output() projectChange = new EventEmitter<Project>();

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  projectForm!: FormGroup;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.projectForm && changes.visible && this.project?.id) {
      this.projectForm.setValue({
        title: this.project.title,
        description: this.project.description,
      });
    }
  }

  onSubmit(): void {
    if (this.project.id) {
      this.projectService
        .updateProject({
          id: this.project.id,
          ...this.projectForm.value,
        })
        .subscribe((project) => {
          this._close();
          this.projectChange.emit(project);
        });
    } else {
      this.projectService
        .createProject(this.projectForm.value)
        .subscribe((project) => {
          this._close();
          this.projectChange.emit(project);
        });
    }
  }

  onCancel(): void {
    this._close();
  }

  private _close() {
    this.visibleChange.emit(false);
    this.projectForm.reset();
  }
}
