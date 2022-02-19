import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/match.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {

  public matches: any;
  count = 0;
  currentIndex = -1;
  page = 1;
  title = '';

  constructor(private router: Router, private matchService: MatchService) { }

  ngOnInit(): void {
    this.page = 1;
    this.count = 0;
    this.retrieveMatches();
  }

  retrieveMatches(): void {
    this.matchService.getAll()
      .subscribe({
        next: (data) => {
          this.matches = data;
        },
        error: (e) => console.error(e)
      });
    this.count = this.matches.length;
  }

  refreshList(): void {
    this.retrieveMatches();
    this.currentIndex = -1;
  }

  setActiveMatch(index: number): void {
    this.currentIndex = index;
  }

  redirectMatch(index: number): void {
    this.router.navigate([`/matches/${index}`]);
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.refreshList();
  }
  // searchTitle(): void {
  //   this.currentTutorial = {};
  //   this.currentIndex = -1;

  //   this.tutorialService.findByTitle(this.title)
  //     .subscribe({
  //       next: (data) => {
  //         this.tutorials = data;
  //         console.log(data);
  //       },
  //       error: (e) => console.error(e)
  //     });
  // }

}