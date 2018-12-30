import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { CommonService } from '../services/common.service';
import { UserModel } from '../model/user-model';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.css']
})
export class UserSearchComponent implements OnInit {
  constructor(public dialModalRef: MatDialogRef<UserSearchComponent>, private service: CommonService) {
    this.user = { User_ID: 0, FirstName: '', LastName: '', EmployeeId: 0 };
  }
  users: UserModel[];
  user: UserModel;
  path: string;
  query: string;
  order = 1;

  ngOnInit() {
    this.Initialize();
  }

  Initialize() {
    this.service.getUsers().subscribe(
      restItems => {
        this.users = restItems;
      }
    );
  }

  Select(user: any) {
    this.user = user;
    this.dialModalRef.close(this.user);
  }
}
