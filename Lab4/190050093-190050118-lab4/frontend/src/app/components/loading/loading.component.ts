import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy } from '@angular/core';
import { LoadingService } from "src/app/services/loading.service";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements AfterViewInit, OnDestroy {

  debounceTime: number = 50;
  loading: boolean = true;
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingService,
              private _elmRef: ElementRef,
              private _changeDetectorRef: ChangeDetectorRef) {
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(this.debounceTime)).subscribe(
      (status: boolean) => {
        this._elmRef.nativeElement.style.display = status ? 'block' : 'none';
        this._changeDetectorRef.detectChanges();
      }
    );
  }

  ngAfterViewInit(): void {
    this._elmRef.nativeElement.style.display = 'none';
    // console.log("Loading component initialized");
    this.loadingSubscription = this.loadingScreenService.loadingStatus.pipe(debounceTime(this.debounceTime)).subscribe(
      (status: boolean) => {
        // console.log("Loading status changed to: " + status);
        this._elmRef.nativeElement.style.display = status ? 'block' : 'none';
        this._changeDetectorRef.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}