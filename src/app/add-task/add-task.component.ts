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

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  constructor(public dialog: MatDialog, private service: CommonService) { }

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

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date(this.startDate.setDate(this.startDate.getDate() + 1));

    this.addTaskForm = new FormGroup({
      Task_ID: new FormControl(0),
      Task: new FormControl('', Validators.required),
      IsParent: new FormControl(false),
      ProjectName: new FormControl({ value: '', disabled: true }, Validators.required),
      Priority: new FormControl({ value: 1, disabled: false }, Validators.min(0)),
      ParentTask: new FormControl({ value: '', disabled: true }),
      StartDate: new FormControl({ value: this.startDate.toISOString().substring(0, 10), disabled: false }, Validators.required),
      EndDate: new FormControl({ value: this.endDate.toISOString().substring(0, 10), disabled: false }, Validators.required),
      User: new FormControl({ value: '', disabled: true }, Validators.required)
    });
    this.Initialize();
  }

  Initialize() {
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
    } else {
      this.addTaskForm.get('StartDate').enable();
      this.addTaskForm.get('EndDate').enable();
      this.addTaskForm.get('Priority').enable();
      this.isParentTask = false;
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
      }
    } else {
      if (!this.ValidateFormControls() && this.ValidateDates(this.addTaskForm) && !this.addTaskForm.invalid) {
        let parentId = null;
        if (this.selectedParent && this.selectedParent.Parent_ID) {
          parentId = this.selectedParent.Parent_ID;
        }
        const task: TaskModel = {
          Task_ID: this.addTaskForm.value.Task_ID,
          Task: this.addTaskForm.value.Task,
          Priority: this.addTaskForm.value.Priority,
          StartDate: this.addTaskForm.value.StartDate,
          EndDate: this.addTaskForm.value.EndDate,
          Project_ID: this.selectedProject.Project_ID,
          User_ID: this.selectedUser.User_ID,
          Parent_ID: parentId, Project: '', User: '', ParentTask: ''
        };

        this.service.AddTask(task).subscribe(result => {
          this.OnReset();
        });
      }
    }
  }

  ValidateFormControls() {
    let errorMessage = '';
    let validationFailed = false;
    if (!this.selectedProject || this.selectedProject.Project === '') {
      errorMessage = 'Please select project \n';
      validationFailed = true;
    }
    if (!this.selectedUser || this.selectedUser.FirstName === '') {
      errorMessage = errorMessage + 'Please select User \n';
      validationFailed = true;
    }
    if (validationFailed) {
      alert(errorMessage);
    }
    return validationFailed;
  }

  ValidateDates(formObject: any) {
    if (formObject) {
      const startDate = formObject.value.StartDate;
      const endDate = formObject.value.EndDate;
      if (startDate && endDate) {
        const dt1 = new Date(startDate);
        const dt2 = new Date(endDate);
        if (dt1 > dt2) {
          alert('Start Date cant be greater than End Date');
          return false;
        }
      }
    }
    return true;
  }

  OnReset() {
    this.addTaskForm.reset();
    this.selectedParent = null;
    this.selectedProject = null;
    this.selectedUser = null;
    this.addTaskForm.patchValue({
      SetDate: true, StartDate: this.startDate.toISOString().substring(0, 10),
      EndDate: this.endDate.toISOString().substring(0, 10)
    });
  }
}
