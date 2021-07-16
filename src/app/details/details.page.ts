import { Component } from '@angular/core';
//import { ActivatedRoute, Router }from '@angular/router';
import { PhotoserviceService } from '../photoservice.service';
import { Router } from '@angular/router';  
import { HomePage } from '../home/home.page';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage  {

  constructor(private router: Router,public photoservice: PhotoserviceService,public home:HomePage) { }

  async ionViewWillEnter(){
   await this.home.loadNumberOfNotes();
    await this.home.loadTexts();

  }

  async destroy(){
    await localStorage.clear()
    this.photoservice.no_of_notes = 0;
    console.log("cleared")
    location.reload();
  }

  go(highlight) {   
    console.log("going next")
    this.router.navigate(['viewhigh/'+String(highlight)]);  
  } 


}
