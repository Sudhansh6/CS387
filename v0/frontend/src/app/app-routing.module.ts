import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchListComponent } from './components/match-list/match-list.component';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { PlayerDetailsComponent } from './components/player-details/player-details.component';
import { PointsTableComponent } from './components/points-table/points-table.component';
import { VenueDetailsComponent } from './components/venue-details/venue-details.component';
import { VenueListComponent } from './components/venue-list/venue-list.component';

const routes: Routes = [
  { path: 'matches', component: MatchListComponent},
  { path: 'matches/:id', component: MatchDetailsComponent },
  { path: 'players/:id', component: PlayerDetailsComponent },
  { path: 'pointstable/:year', component: PointsTableComponent },
  { path: 'venues', component: VenueListComponent },
  { path: 'venue/:id', component: VenueDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
