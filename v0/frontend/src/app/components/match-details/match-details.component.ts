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
  totalInnings1: any;
  bowlersInnings1: any;
  
  batsmenInnings2: any;
  totalInnings2: any;
  bowlersInnings2: any;
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
    console.log("Fetching data...")
    this.matchService.getBatsmenInnings1(id)
      .subscribe({
        next: (data) => {
          this.batsmenInnings1 = data;
          
        },
        error: (e) => console.error(e)
      });
    this.matchService.getTotalInnings1(id)
    .subscribe({
      next: (data) => {
        this.totalInnings1 = data[0];
      },
      error: (e) => console.error(e)
    });
    this.matchService.getBowlersInnings1(id)
    .subscribe({
      next: (data) => {
        this.bowlersInnings1 = data;
        
      },
      error: (e) => console.error(e)
    });
    
    this.matchService.getBatsmenInnings2(id)
      .subscribe({
        next: (data) => {
          this.batsmenInnings2 = data;
          
        },
        error: (e) => console.error(e)
      });
    this.matchService.getTotalInnings2(id)
    .subscribe({
      next: (data) => {
        this.totalInnings2 = data[0];
        console.log(data);
      },
      error: (e) => console.error(e)
    });
    this.matchService.getBowlersInnings2(id)
    .subscribe({
      next: (data) => {
        this.bowlersInnings2 = data;
      },
      error: (e) => console.error(e)
    });
  }

  redirectPlayer(id: string): void {
    this.router.navigate([`/players/${id}`]);
  }

}
