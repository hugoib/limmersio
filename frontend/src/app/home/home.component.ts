import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  limmersifiedText: any[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService) { }

  inputText = '';
  outputText = '';
  spinnerWait: boolean;

  ngOnInit() {
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  public clear() {
    this.inputText = '';
    this.outputText = '';
  }

  public limmersify() {
    this.spinnerWait = true;

    this.dataService.sendGetRequest(this.inputText).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.spinnerWait = false;
      console.log(data);
      this.outputText = String(data.body);
    },
      error => {
        this.spinnerWait = false;
      });
  }
}
