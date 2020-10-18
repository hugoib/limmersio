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

  inputText = 'Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffee species. When coffee berries turn from green to bright red in color – indicating ripeness – they are picked, processed, and dried. ';
  outputText = '';
  selectedLevelSlider = 1;
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

  public formJSON() {
    const level = ['a', 'b', 'c'];
    const data = '{ ' +
        '"text": "' + this.inputText + '", ' +
        '"level":  "' + level[this.selectedLevelSlider - 1 ] +
         '"}';
    const paramsJSON = JSON.parse(data);
    console.log(paramsJSON);
    return paramsJSON;
}

  public limmersify() {
    this.spinnerWait = true;

    const requestBody = this.formJSON();
    if (this.inputText !== ''){
      this.dataService.sendGetRequest(requestBody).pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.spinnerWait = false;
        console.log(data);
        this.outputText = String(data.body);
      },
        error => {
          this.spinnerWait = false;
        });
    }
    else{
      this.spinnerWait = false;
      alert('Please insert text.');
    }
  }
}
