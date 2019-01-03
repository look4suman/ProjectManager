import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from '../services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserModel } from '../model/user-model';
import { ProjectModel } from '../model/project-model';
import { TaskModel } from '../model/task-model';
import { ParentTaskModel } from '../model/parent-task-model';
import { ProjectSearchComponent } from '../project-search/project-search.component';
import { UserSearchComponent } from '../user-search/user-search.component';
import { ParentTaskSearchComponent } from '../parent-task-search/parent-task-search.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  constructor(public dialog: MatDialog, private service: CommonService, private route: ActivatedRoute) { }

  btnText: string;
  addTaskForm: FormGroup;
  formSubmitted = false;
  isUpdating = false;
  path: string;
  order: number = 1;
  startDate: Date;
  endDate: Date;
  selectedUser: UserModel;
  selectedProject: ProjectModel;
  selectedParent: ParentTaskModel;
  isParentTask: boolean;
  isProjectDisabled: boolean;
  taskId: number;

  ngOnInit() {
    this.taskId = this.route.snapshot.params.taskid;

    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate((this.startDate).getDate() + 1);
    this.endDate.setDate((this.startDate).getDate() + 1);

    this.addTaskForm = new FormGroup({
      Task_ID: new FormControl(0),
      Task: new FormControl('', Validators.required),
      IsParent: new FormControl(false),
      ProjectName: new FormControl({ value: '', disabled: true }, Validators.required),
      Priority: new FormControl({ value: 0, disabled: false }, Validators.min(0)),
      ParentTask: new FormControl({ value: '', disabled: true }),
      StartDate: new FormControl({ value: this.startDate.toISOString().substring(0, 10), disabled: false }, Validators.required),
      EndDate: new FormControl({ value: this.endDate.toISOString().substring(0, 10), disabled: false }, Validators.required),
      User: new FormControl({ value: '', disabled: true }, Validators.required)
    });

    if (this.taskId) {
      this.OnEdit();
    } else {
      this.Initialize();
    }
  }

  OnEdit() {
    this.formSubmitted = false;
    this.isUpdating = true;
    this.btnText = 'Edit Task';
    this.service.GetTaskById(this.taskId).subscribe(o =>
      this.PopulateDetails(o)
    );
  }

  PopulateDetails(model: TaskModel) {
    if (model) {
      this.addTaskForm.patchValue({
        Task_ID: model.Task_ID,
        Task: model.Task,
        ProjectName: model.Project,
        Priority: model.Priority,
        ParentTask: model.ParentTask,
        StartDate: new Date(model.StartDate).toISOString().substring(0, 10),
        EndDate: new Date(model.EndDate).toISOString().substring(0, 10),
        User: model.User,
      });

      if (model.Project_ID) {
        this.selectedProject = new ProjectModel();
        this.selectedProject.Project_ID = model.Project_ID;
      }

      if (model.Parent_ID) {
        this.selectedParent = new ParentTaskModel();
        this.selectedParent.Parent_ID = model.Parent_ID;
      }

      if (model.User_ID) {
        this.selectedUser = new UserModel();
        this.selectedUser.User_ID = model.User_ID;
      }
      this.isProjectDisabled = true;
      this.addTaskForm.get('IsParent').disable();
    }
  }

  Initialize() {
    this.btnText = 'Add Task';
    this.formSubmitted = false;
    this.isUpdating = false;
    this.selectedUser = null;
    this.selectedProject = null;
    this.selectedParent = null;
  }

  get f() { return this.addTaskForm.controls; }

  setParentTask(e: any) {
    if (e.target.checked) {
      this.addTaskForm.get('StartDate').disable();
      this.addTaskForm.get('EndDate').disable();
      this.addTaskForm.get('Priority').disable();
      this.addTaskForm.get('ParentTask').disable();
      this.isParentTask = true;
      this.isProjectDisabled = true;
    } else {
      this.addTaskForm.get('StartDate').enable();
      this.addTaskForm.get('EndDate').enable();
      this.addTaskForm.get('Priority').enable();
      this.isParentTask = false;
      this.isProjectDisabled = false;
    }
  }

  OpenProjectModal() {
    const dialogRef = this.dialog.open(ProjectSearchComponent, {
      width: '600px',
      height: '400px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedProject = result;
      this.addTaskForm.patchValue({ ProjectName: result.Project });
    });
  }

  OpenUserModal() {
    const dialogRef = this.dialog.open(UserSearchComponent, {
      width: '600px',
      height: '400px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedUser = result;
      this.addTaskForm.patchValue({ User: result.FirstName + ' ' + result.LastName });
    });
  }

  OpenParentTaskModal() {
    const dialogRef = this.dialog.open(ParentTaskSearchComponent, {
      width: '600px',
      height: '400px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedParent = result;
      this.addTaskForm.patchValue({ ParentTask: result.Parent_Task });
    });
  }

  OnFormSubmit() {
    this.formSubmitted = true;

    if (this.isParentTask) {
      if (!this.addTaskForm.invalid) {
        let parentTask: ParentTaskModel = new ParentTaskModel();
        parentTask.Parent_Task = this.addTaskForm.value.Task;
        this.service.AddParentTask(parentTask).subscribe();
        this.OnReset();
      }
    } else {
      if (this.ValidateDates(this.addTaskForm) && !this.addTaskForm.invalid) {
        let task: TaskModel = {
          Task_ID: this.addTaskForm.value.Task_ID,
          Task: this.addTaskForm.value.Task,
          Priority: this.addTaskForm.value.Priority,
          StartDate: this.addTaskForm.value.StartDate,
          EndDate: this.addTaskForm.value.EndDate,
          Project_ID: this.selectedProject ? this.selectedProject.Project_ID : null,
          User_ID: this.selectedUser ? this.selectedUser.User_ID : null,
          Parent_ID: this.selectedParent ? this.selectedParent.Parent_ID : null,
          Project: '',
          User: '',
          ParentTask: ''
        };

        if (this.isUpdating) {
          this.service.UpdateTask(task).subscribe();
        } else {
          this.service.AddTask(task).subscribe();
        }
        this.OnReset();
      }
    }
  }

  ValidateDates(formObject: any) {
    if (formObject) {
      const startDate = formObject.value.StartDate;
      const endDate = formObject.value.EndDate;
      if (startDate && endDate) {
        const dt1 = new Date(startDate);
        const dt2 = new Date(endDate);
        if (dt1 > dt2) {
          alert('Start Date cannot be greater than End Date');
          return false;
        }
      }
    }
    return true;
  }

  OnReset() {
    this.addTaskForm.reset();
    this.Initialize();
    this.addTaskForm.patchValue({
      Priority: 0,
      StartDate: this.startDate.toISOString().substring(0, 10),
      EndDate: this.endDate.toISOString().substring(0, 10)
    });
  }
}
