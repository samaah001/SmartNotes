import { Component } from '@angular/core';
import { PhotoserviceService } from '../photoservice.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public photoservice: PhotoserviceService) {}
  addPhotoToGallery() {
    this.photoservice.addNewToGallery();
  }
}
