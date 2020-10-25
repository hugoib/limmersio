import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer} from '@angular/platform-browser';

export interface target_language_type {
  item: string;
  viewValue: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  outputText = '';
  selected_target_language = '';
  limmersifiedText: any[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private dataService: DataService, private domSanitizer: DomSanitizer) { }

  target_language_types: target_language_type[] = [
    {item: 'af', viewValue: 'afrikaans'},
    {item: 'sq', viewValue: 'albanian'},
    {item: 'am', viewValue: 'amharic'},
    {item: 'ar', viewValue: 'arabic'},
    {item: 'hy', viewValue: 'armenian'},
    {item: 'az', viewValue: 'azerbaijani'},
    {item: 'eu', viewValue: 'basque'},
    {item: 'be', viewValue: 'belarusian'},
    {item: 'bn', viewValue: 'bengali'},
    {item: 'bs', viewValue: 'bosnian'},
    {item: 'bg', viewValue: 'bulgarian'},
    {item: 'ca', viewValue: 'catalan'},
    {item: 'ceb', viewValue: 'cebuano'},
    {item: 'ny', viewValue: 'chichewa'},
    {item: 'zh-cn', viewValue: 'chinese (simplified)'},
    {item: 'zh-tw', viewValue: 'chinese (traditional)'},
    {item: 'co', viewValue: 'corsican'},
    {item: 'hr', viewValue: 'croatian'},
    {item: 'cs', viewValue: 'czech'},
    {item: 'da', viewValue: 'danish'},
    {item: 'nl', viewValue: 'dutch'},
    {item: 'en', viewValue: 'english'},
    {item: 'eo', viewValue: 'esperanto'},
    {item: 'et', viewValue: 'estonian'},
    {item: 'tl', viewValue: 'filipino'},
    {item: 'fi', viewValue: 'finnish'},
    {item: 'fr', viewValue: 'french'},
    {item: 'fy', viewValue: 'frisian'},
    {item: 'gl', viewValue: 'galician'},
    {item: 'ka', viewValue: 'georgian'},
    {item: 'de', viewValue: 'german'},
    {item: 'el', viewValue: 'greek'},
    {item: 'gu', viewValue: 'gujarati'},
    {item: 'ht', viewValue: 'haitian creole'},
    {item: 'ha', viewValue: 'hausa'},
    {item: 'haw', viewValue: 'hawaiian'},
    {item: 'iw', viewValue: 'hebrew'},
    {item: 'he', viewValue: 'hebrew'},
    {item: 'hi', viewValue: 'hindi'},
    {item: 'hmn', viewValue: 'hmong'},
    {item: 'hu', viewValue: 'hungarian'},
    {item: 'is', viewValue: 'icelandic'},
    {item: 'ig', viewValue: 'igbo'},
    {item: 'id', viewValue: 'indonesian'},
    {item: 'ga', viewValue: 'irish'},
    {item: 'it', viewValue: 'italian'},
    {item: 'ja', viewValue: 'japanese'},
    {item: 'jw', viewValue: 'javanese'},
    {item: 'kn', viewValue: 'kannada'},
    {item: 'kk', viewValue: 'kazakh'},
    {item: 'km', viewValue: 'khmer'},
    {item: 'ko', viewValue: 'korean'},
    {item: 'ku', viewValue: 'kurdish (kurmanji)'},
    {item: 'ky', viewValue: 'kyrgyz'},
    {item: 'lo', viewValue: 'lao'},
    {item: 'la', viewValue: 'latin'},
    {item: 'lv', viewValue: 'latvian'},
    {item: 'lt', viewValue: 'lithuanian'},
    {item: 'lb', viewValue: 'luxembourgish'},
    {item: 'mk', viewValue: 'macedonian'},
    {item: 'mg', viewValue: 'malagasy'},
    {item: 'ms', viewValue: 'malay'},
    {item: 'ml', viewValue: 'malayalam'},
    {item: 'mt', viewValue: 'maltese'},
    {item: 'mi', viewValue: 'maori'},
    {item: 'mr', viewValue: 'marathi'},
    {item: 'mn', viewValue: 'mongolian'},
    {item: 'my', viewValue: 'myanmar (burmese)'},
    {item: 'ne', viewValue: 'nepali'},
    {item: 'no', viewValue: 'norwegian'},
    {item: 'or', viewValue: 'odia'},
    {item: 'ps', viewValue: 'pashto'},
    {item: 'fa', viewValue: 'persian'},
    {item: 'pl', viewValue: 'polish'},
    {item: 'pt', viewValue: 'portuguese'},
    {item: 'pa', viewValue: 'punjabi'},
    {item: 'ro', viewValue: 'romanian'},
    {item: 'ru', viewValue: 'russian'},
    {item: 'sm', viewValue: 'samoan'},
    {item: 'gd', viewValue: 'scots gaelic'},
    {item: 'sr', viewValue: 'serbian'},
    {item: 'st', viewValue: 'sesotho'},
    {item: 'sn', viewValue: 'shona'},
    {item: 'sd', viewValue: 'sindhi'},
    {item: 'si', viewValue: 'sinhala'},
    {item: 'sk', viewValue: 'slovak'},
    {item: 'sl', viewValue: 'slovenian'},
    {item: 'so', viewValue: 'somali'},
    {item: 'es', viewValue: 'spanish'},
    {item: 'su', viewValue: 'sundanese'},
    {item: 'sw', viewValue: 'swahili'},
    {item: 'sv', viewValue: 'swedish'},
    {item: 'tg', viewValue: 'tajik'},
    {item: 'ta', viewValue: 'tamil'},
    {item: 'te', viewValue: 'telugu'},
    {item: 'th', viewValue: 'thai'},
    {item: 'tr', viewValue: 'turkish'},
    {item: 'uk', viewValue: 'ukrainian'},
    {item: 'ur', viewValue: 'urdu'},
    {item: 'ug', viewValue: 'uyghur'},
    {item: 'uz', viewValue: 'uzbek'},
    {item: 'vi', viewValue: 'vietnamese'},
    {item: 'cy', viewValue: 'welsh'},
    {item: 'xh', viewValue: 'xhosa'},
    {item: 'yi', viewValue: 'yiddish'},
    {item: 'yo', viewValue: 'yoruba'},
    {item: 'zu', viewValue: 'zulu'}
  ];

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
    console.log(this.selected_target_language);
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
        '"level":  "' + level[this.selectedLevelSlider - 1 ] + '", ' +
        '"target_language":  "' + this.selected_target_language +
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
    if (this.inputText !== '' || this.selected_target_language !== ''){
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
      alert('Please insert text and/or select level');
    }
  }
}
