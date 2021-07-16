/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { photo } from '../photo';
import { PhotoserviceService } from '../photoservice.service';
import { ActionSheetController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(public photoservice: PhotoserviceService,public actionSheetController: ActionSheetController) {}
  async ngOnInit() {
    await this.photoservice.loadSaved();
  }
  addPhotoToGallery() {
    this.photoservice.addNewToGallery();
  }
  
  Highlight_Done(){
    this.photoservice.Highlight_Done();
  }  
  saveText(){
    this.photoservice.saveText();
  }
  loadTexts(){
    this.photoservice.loadTexts();
  }
  loadNumberOfNotes(){
    this.photoservice.loadNumberOfNotes();
  }
 


  
  public async showActionSheet(photo: photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoservice.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      },
      {
        text:'desccription',
        role:'forward',
        icon:'arrow-forward-outline',
        handler:()=>{
          
        }
      }
    ]
    });
    await actionSheet.present();
  }
}

