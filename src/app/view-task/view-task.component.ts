import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { ProjectSearchComponent } from '../project-search/project-search.component';
import { TaskModel } from '../model/task-model';
import { ProjectModel } from '../model/project-model';

@Component({
  selector: 'app-view-task',
  templateUrl: './view-task.component.html',
  styleUrls: ['./view-task.component.css']
})
export class ViewTaskComponent implements OnInit {

  constructor(private dialog: MatDialog, private service: CommonService, private router: Router) { }
  tasks: TaskModel[];
  selectedProject: ProjectModel;
  ProjectName: string;
  path: string;
  query: string;
  order = 1;

  ngOnInit() {
    this.Initialize();
  }

  Initialize() {
    this.service.GetTasks().subscribe(
      items => {
        this.tasks = items;
      }
    );
  }

  OpenProjectSearchModal() {
    const dialogRef = this.dialog.open(ProjectSearchComponent, {
      width: '600px',
      height: '400px',
      data: ''
    });
    dialogRef.afterClosed().subscribe(result => {
      this.selectedProject = result;
      this.ProjectName = result.Project;
      this.tasks = this.tasks.filter(item => {
        return item.Project_ID === this.selectedProject.Project_ID;
      });
    });
  }

  ClearSearch() {
    this.Initialize();
    this.selectedProject = null;
    this.ProjectName = '';
  }

  SortData(prop: string) {
    this.path = prop;
    this.order = this.order * (-1)
    return false;
  }

  EndTask(task: TaskModel) {
    this.service.EndTask(task).subscribe(item => {
      this.Initialize();
      this.ClearSearch();
    });
  }

  EditTask(task: TaskModel) {
    this.router.navigate(['addtask', { taskid: task.Task_ID }]);
  }
}
