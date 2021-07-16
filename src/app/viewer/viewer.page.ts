import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoserviceService } from '../photoservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
})
export class ViewerPage implements OnInit {
  path: any
  x: any

  decodedResult: string;
  storedResult: string;
  constructor(private route: ActivatedRoute, 
    // public photoservice: PhotoService, 
    private router: Router,
    private photoservice :PhotoserviceService,
    private http: HttpClient) { }

   async ngOnInit() {
     // this.taa.printer()

    // First get the product id from the current route.
    this.path = this.route.snapshot.paramMap.get('path');
    // console.log("here are the parameters");
    // console.log(this.path)

    await this.photoservice.loadSaved();
    this.x = this.photoservice.photos;
    // console.log(this.taa.photoss)

  }
  back() {

    this.router.navigate(['./Home']);

  }

  decodeImage() {
    var headers = {
      'apikey': 'helloworld'
    }
    const imageData = new FormData();
    
    const targetImage = this.photoservice.photos[1];
    imageData.append('base64Image', targetImage.webviewPath);
    this.http.post('https://api.ocr.space/parse/image', imageData, 
    { headers: new HttpHeaders(headers) }
    ).subscribe((data: any) => {
      console.log("doing")
      console.log('my data: ', data);
      this.decodedResult = data.ParsedResults[0].ParsedText
      localStorage.setItem('first',this.decodedResult);
    }, err=> console.log(err))
  }

  showResults(){
    this.storedResult = localStorage.getItem('first'); 
  }

}
