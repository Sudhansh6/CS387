import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/models/match.model';
import { MatchService } from 'src/app/services/match.service';

@Component({
  selector: 'app-match-list',
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {

  matches?: Match[];
  currentMatch: Match = {};
  currentIndex = -1;
  title = '';

  constructor(private matchService: MatchService) { }

  ngOnInit(): void {
    this.retrieveMatches();
  }

  retrieveMatches(): void {
    this.matchService.getAll()
      .subscribe({
        next: (data) => {
          this.matches = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  refreshList(): void {
    this.retrieveMatches();
    this.currentMatch = {};
    this.currentIndex = -1;
  }

  setActiveMatch(match: Match, index: number): void {
    this.currentMatch = match;
    this.currentIndex = index;
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