import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  outputText = '';
  limmersifiedText: any[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService, private domSanitizer: DomSanitizer) { }


  inputText = 'Coffee is a brewed drink prepared from roasted coffee beans, the seeds of berries from certain Coffee species. When coffee berries turn from green to bright red in color – indicating ripeness – they are picked, processed, and dried. ';  selectedLevelSlider = 1;
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
    // Clean forbidden JSON characters

    const text = this.inputText;
    let newText = '';
    // tslint:disable-next-line: prefer-for-of
    for ( let i = 0; i < text.length; i++ ){
      if ( !(text[i] === '\n' || text[i] === '\r') ){
        newText += text[i];
      }
    }

    const data = '{ ' +
        '"text": "' + newText.replace(/[!@#$^&%*()+=[\]/{}|:<>?,.\\-]/g, '') + '", ' +
        '"level":  "' + level[this.selectedLevelSlider - 1 ] +
         '"}';
    const paramsJSON = JSON.parse(data);
    console.log(paramsJSON);
    return paramsJSON;
}

getHtml(html){
  return this.domSanitizer.bypassSecurityTrustHtml(html);
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
