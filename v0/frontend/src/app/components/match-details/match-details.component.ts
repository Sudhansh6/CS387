import { Component, Input, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-match-details',
  templateUrl: './match-details.component.html',
  styleUrls: ['./match-details.component.scss']
})
export class MatchDetailsComponent implements OnInit {

  @Input() viewMode = true;

  batsmenInnings1: any;
  message = '';

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    if (this.viewMode) {
      this.message = 'Loading...';
      this.getMatch(this.route.snapshot.params["id"]);
    }
  }

  getMatch(id: string): void {
    this.matchService.getBatsmenInnings1(id)
      .subscribe({
        next: (data) => {
          this.batsmenInnings1 = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

}
