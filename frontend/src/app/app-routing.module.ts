import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatchListComponent } from './components/match-list/match-list.component';

const routes: Routes = [
  {path: 'match', component: MatchListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
