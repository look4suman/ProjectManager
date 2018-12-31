import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MatDialogRef } from '@angular/material';
import { ParentTaskModel } from '../model/parent-task-model';

@Component({
  selector: 'app-parent-task-search',
  templateUrl: './parent-task-search.component.html',
  styleUrls: ['./parent-task-search.component.css']
})
export class ParentTaskSearchComponent implements OnInit {

  constructor(private commonService: CommonService, public dialModalRef: MatDialogRef<ParentTaskSearchComponent>) { }
  parentTasks: ParentTaskModel[];
  path: string;
  query: string;
  order = 1;
  ngOnInit() {
    this.commonService.GetParentTasks().subscribe(result => {
      this.parentTasks = result;
    });
  }

  Select(task: any) {
    this.dialModalRef.close(task);
  }
}
