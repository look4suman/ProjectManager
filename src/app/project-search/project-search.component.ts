import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MatDialogRef } from '@angular/material';
import { ProjectModel } from '../model/project-model';

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.component.html',
  styleUrls: ['./project-search.component.css']
})
export class ProjectSearchComponent implements OnInit {

  constructor(private commonService: CommonService, public dialModalRef: MatDialogRef<ProjectSearchComponent>) { }
  projects: ProjectModel[];
  path: string;
  query: string;
  order = 1;
  ngOnInit() {
    this.commonService.GetProjects().subscribe(result => {
      this.projects = result;
    });
  }

  Select(project: any) {
    this.dialModalRef.close(project);
  }
}
