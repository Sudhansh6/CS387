import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PointsTableService } from 'src/app/services/points-table.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-points-table',
  templateUrl: './points-table.component.html',
  styleUrls: ['./points-table.component.scss']
})
export class PointsTableComponent implements OnInit {

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private pointsTableService: PointsTableService) { }

  pointsTable: any;
  year: any;

  async ngOnInit()
  {
    this.year = Number(this.route.snapshot.params["year"]);
    this.retrievePointsTable(this.route.snapshot.params["year"]);
  }

  async retrievePointsTable(year: any)
  {
    this.pointsTable = await lastValueFrom(this.pointsTableService.getplayerinfo(year));
  }

}
