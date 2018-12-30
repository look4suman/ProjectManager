import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserModel } from '../model/user-model';
import { Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  constructor(private service: CommonService, private router: Router) { }

  btnText: string;
  addUserForm: FormGroup;
  formSubmitted = false;
  users: UserModel[];
  isUpdating: boolean;
  path: string;
  order: number = 1;

  ngOnInit() {
    this.addUserForm = new FormGroup({
      User_ID: new FormControl(''),
      FirstName: new FormControl('', Validators.required),
      LastName: new FormControl('', Validators.required),
      EmployeeId: new FormControl('', Validators.required)
    });

    this.Initialize();
  }

  get f() { return this.addUserForm.controls; }

  Initialize(): any {
    this.OnReset();
    this.GetUsers();
  }

  GetUsers(): any {
    this.service.GetUsers().subscribe(
      items => {
        this.users = items;
      }
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (!this.addUserForm.invalid) {
      let userModel: UserModel = new UserModel();
      userModel.User_ID = this.addUserForm.value.User_ID;
      userModel.FirstName = this.addUserForm.value.FirstName;
      userModel.LastName = this.addUserForm.value.LastName;
      userModel.EmployeeId = this.addUserForm.value.EmployeeId;

      if (this.isUpdating) {
        this.service.UpdateUser(userModel).subscribe(() => {
          this.GetUsers();
        });
      } else {
        this.service.AddUser(userModel).subscribe(() => {
          this.GetUsers();
        });
      }
      this.OnReset();
    }
  }

  OnReset() {
    this.addUserForm.reset();
    this.btnText = 'Add User';
    this.formSubmitted = false;
    this.isUpdating = false;
  }

  OnEdit(user: UserModel) {
    this.btnText = "Update User";
    this.isUpdating = true;
    this.addUserForm.patchValue({
      User_ID: user.User_ID,
      FirstName: user.FirstName,
      LastName: user.LastName,
      EmployeeId: user.EmployeeId
    });
  }

  OnDelete(user: UserModel) {
    this.service.DeleteUser(user.User_ID).subscribe(() => {
      this.GetUsers();
    });
  }

  SetSortParam(param: string) {
    this.path = param;
    this.order = this.order * -1;
  }
}
