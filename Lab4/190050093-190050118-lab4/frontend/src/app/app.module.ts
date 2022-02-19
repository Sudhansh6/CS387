import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatchListComponent } from './components/match-list/match-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MatchDetailsComponent } from './components/match-details/match-details.component';
import { PlayerDetailsComponent } from './components/player-details/player-details.component';
import { PointsTableComponent } from './components/points-table/points-table.component';
import { VenueDetailsComponent } from './components/venue-details/venue-details.component';
import { VenueListComponent } from './components/venue-list/venue-list.component';
import { VenueAddComponent } from './components/venue-add/venue-add.component';
import { FormsModule } from '@angular/forms';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingInterceptor } from './components/loading.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MatchListComponent,
    MatchDetailsComponent,
    PlayerDetailsComponent,
    PointsTableComponent,
    VenueDetailsComponent,
    VenueListComponent,
    VenueAddComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    MDBBootstrapModule.forRoot(),
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
