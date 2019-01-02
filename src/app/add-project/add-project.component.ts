import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserModel } from '../model/user-model';
import { CommonService } from '../services/common.service';
import { ProjectModel } from '../model/project-model';
import { MatDialog } from '@angular/material';
import { UserSearchComponent } from '../user-search/user-search.component';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {

  constructor(public dialog: MatDialog, private service: CommonService) { }

  addProjectForm: FormGroup;
  formSubmitted = false;
  btnText: string;
  projects: ProjectModel[];
  isUpdating: boolean;
  path: string;
  order: number = 1;
  isSetDateChecked = false;
  startDate: Date;
  endDate: Date;
  manager: UserModel;

  ngOnInit() {
    this.startDate = new Date();
    this.endDate = new Date();
    this.startDate.setDate((this.startDate).getDate() + 1);
    this.endDate.setDate((this.startDate).getDate() + 1);

    this.addProjectForm = new FormGroup({
      Project_ID: new FormControl(0),
      ProjectName: new FormControl('', Validators.required),
      StartDate: new FormControl({ value: this.startDate.toISOString().substring(0, 10), disabled: !this.isSetDateChecked }, Validators.required),
      EndDate: new FormControl({ value: this.endDate.toISOString().substring(0, 10), disabled: !this.isSetDateChecked }, Validators.required),
      SetDate: new FormControl(this.isSetDateChecked),
      Priority: new FormControl(0),
      ManagerName: new FormControl({ value: '', disabled: true })
    });
    this.Initialize();
    this.GetProjects();
  }

  Initialize() {
    this.btnText = 'Add User';
    this.formSubmitted = false;
    this.isUpdating = false;
    this.manager = null;
  }

  get f() { return this.addProjectForm.controls; }

  GetProjects(): any {
    this.service.GetProjects().subscribe(restItems => {
      this.projects = restItems;
    });
  }

  setDateChanged(e: any) {
    if (e.target.checked) {
      this.addProjectForm.get('StartDate').enable();
      this.addProjectForm.get('EndDate').enable();
    } else {
      this.addProjectForm.get('StartDate').disable();
      this.addProjectForm.get('EndDate').disable();

      this.addProjectForm.patchValue({
        StartDate: this.startDate.toISOString().substring(0, 10),
        EndDate: this.endDate.toISOString().substring(0, 10)
      });
    }
  }

  OpenModal() {
    const dialogRef = this.dialog.open(UserSearchComponent, {
      width: '600px',
      height: '400px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.addProjectForm.patchValue({ ManagerName: result.FirstName + ' ' + result.LastName });
      this.manager = result;
    });
  }

  OnFormSubmit() {
    this.formSubmitted = true;
    if (this.ValidateDates(this.addProjectForm) && !this.addProjectForm.invalid) {
      let project: ProjectModel = new ProjectModel();
      project.Project_ID = this.addProjectForm.value.Project_ID;
      project.Project = this.addProjectForm.value.ProjectName;
      project.Priority = this.addProjectForm.value.Priority;
      project.StartDate = this.addProjectForm.getRawValue().StartDate;
      project.EndDate = this.addProjectForm.getRawValue().EndDate;
      project.SetDate = this.addProjectForm.getRawValue().SetDate;
      if (this.manager) {
        project.UserId = this.manager.User_ID;
      }

      if (this.isUpdating) {
        this.UpdateProject(project);
      } else {
        this.AddProject(project);
      }

      this.OnReset();
    }
  }

  AddProject(project: ProjectModel): any {
    this.service.AddProject(project).subscribe(() => {
      this.GetProjects();
    });
  }

  UpdateProject(project: ProjectModel): any {
    this.service.UpdateProject(project).subscribe(() => {
      this.GetProjects();
    });
  }

  OnReset() {
    this.addProjectForm.reset();
    this.Initialize();
    this.addProjectForm.patchValue({
      StartDate: this.startDate.toISOString().substring(0, 10),
      EndDate: this.endDate.toISOString().substring(0, 10),
      Priority: 0,
      SetDate: false
    });
  }

  ValidateDates(formObject: any) {
    if (formObject) {
      const startDate = formObject.getRawValue().StartDate;
      const endDate = formObject.getRawValue().EndDate;
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

  SetSortParam(param: string) {
    this.path = param;
    this.order = this.order * -1;
  }

  OnEdit(model: ProjectModel) {
    this.btnText = "Update Project";
    this.isUpdating = true;

    if (model.UserId) {
      let managerName: string;
      this.service.GetUserById(model.UserId).subscribe(
        o => this.addProjectForm.patchValue({
          ManagerName: (o.FirstName + " " + o.LastName)
        }));
    }
    this.addProjectForm.patchValue({
      Project_ID: model.Project_ID,
      ProjectName: model.Project,
      StartDate: new Date(model.StartDate).toISOString().substring(0, 10),
      EndDate: new Date(model.EndDate).toISOString().substring(0, 10),
      Priority: model.Priority,
      SetDate: model.SetDate
    });
  }

  OnSuspend(model: ProjectModel) {
    this.service.EndProject(model).subscribe(() => {
      this.GetProjects();
    });
  }
}
