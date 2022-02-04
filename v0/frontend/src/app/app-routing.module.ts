import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchListComponent } from './components/match-list/match-list.component';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { PlayerDetailsComponent } from './components/player-details/player-details.component';
import { PointsTableComponent } from './components/points-table/points-table.component';
import { VenueAddComponent } from './components/venue-add/venue-add.component';

const routes: Routes = [
  { path: 'matches', component: MatchListComponent},
  { path: 'matches/:id', component: MatchDetailsComponent },
  { path: 'players/:id', component: PlayerDetailsComponent },
  { path: 'pointstable/:year', component: PointsTableComponent },
  { path: 'venues/add', component: VenueAddComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
