import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoserviceService } from '../photoservice.service';
import { HomePage } from '../home/home.page';
@Component({
  selector: 'app-viewhigh',
  templateUrl: './viewhigh.page.html',
  styleUrls: ['./viewhigh.page.scss'],
})
export class ViewhighPage implements OnInit {
  highlight:any;
  constructor(private photoservice:PhotoserviceService,
    private route:ActivatedRoute,
    private router:Router,
    public home:HomePage) { }
    async ionViewWillEnter(){
      await this.home.loadNumberOfNotes()
      await this.home.loadTexts()
  
    }
  ngOnInit() {
    this.highlight = this.route.snapshot.paramMap.get('high');
    console.log(this.highlight)
  }
  go(){
    this.router.navigate(['']);
  }
}
