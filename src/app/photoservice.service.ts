/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/quotes
import {
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Camera,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
//import { photo } from './photo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//declare var TinyQ;
declare var  consoler:String ;
declare var proceed:boolean;

@Injectable({
  providedIn: 'root',
})
export class PhotoserviceService {
  
  
  public photos: Photo[] = [];
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private PHOTO_STORAGE: string = 'photos';
  decodedResult: string;
  storedResult: string;
  showOnScreen:any;
  Spinner:boolean = false;
  no_of_notes:number;
  texts_array = [];
  loadingDone:boolean = false;
  highLightFlag:boolean = false;
  highlights = [];

  constructor(private http: HttpClient,public router:Router) {
   //TinyQ.init();
  }
  cliked(){
    if(consoler){
      consoler = consoler.split("%22").join("")
    consoler = consoler.split("%20").join(" ")
    consoler = consoler.split("%0D%0A").join(" ") 
    consoler = consoler.split("%3E").join(" ")
    consoler = consoler.split("%0A").join(" ") 
    consoler = consoler.split("%0D").join(" ") 

    }
    else{
      consoler=this.showOnScreen.substring(0,30);
    }
  }
  async ngOnInit() {
    // this.no_of_notes = 0;
    await this.loadNumberOfNotes();
    // await console.log("number of notes from NgOnInit ",this.no_of_notes)
    // await this.loadTexts()
    // this.foo();
  }

  foo() {
    console.log("foooooooooooooooooooooooo")
    let selection =  document.getSelection();
    // let selRange = 
    // selection.selectionStart (0,3);
// do stuff with the range

    console.log(selection); 
}
  
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera, 
      quality: 100,
    });
    const savedFile = await this.savePicture(capturedPhoto);
    
  }
   private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);
    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
  // const savedFile= await Filesystem.writeFile({
    this.decodeImage({
      filepath: fileName,
        webviewPath: base64Data
    })
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory 
  }
  decodeImage(imm) {
    this.Spinner = true;
    console.log("decoding")
    var headers = {
      'apikey': '50f01a276388957'          // keep this hidden
      // 50f01a276388957
    }
    const imageData = new FormData();
    
    const targetImage = imm;
    imageData.append('base64Image', targetImage.webviewPath);
    // setTimeout(
      this.http.post('https://api.ocr.space/parse/image', imageData, 
    { headers: new HttpHeaders(headers) }
    ).subscribe((data: any) => {
      console.log("doing")
      console.log('my data: ', data);
      this.Spinner = false
      if(data.IsErroredOnProcessing){
        this.showOnScreen = "ERROR"
      }
      else{
        this.decodedResult = data.ParsedResults[0].ParsedText
        this.showOnScreen = this.decodedResult;
      }
      
      localStorage.setItem('first',this.decodedResult);
    }, err=> {console.log(err);
      this.showOnScreen = "Unable to convert to text for some reason\n Make sure you've an internet connection";
      this.Spinner = false;
    } )
  }
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath);
    const blob = await response.blob();
    return (await this.convertBlobToBase64(blob)) as string;
  }
  public getphoto(photo : Photo){
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
  }
  public async deletePicture(photo: Photo, position: number) {
    console.log(photo.filepath);
    // Remove this photo from the Photos reference data array
    this.photos.splice(position, 1);


    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];
    // Display the photo by reading into base64 format
    for (const photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }
  go(path) {
    this.router.navigate(['viewer/'+String(path)]);  
  } 

  public async Highlight_Done(){
    await this.cliked()
    await localStorage.setItem(String(this.no_of_notes)+"h",String(consoler));
    this.highLightFlag = false;
    this.showOnScreen = ""

    this.router.navigate(['./details']); 

  }

  public async saveText(){

    console.log("saved");
    this.highLightFlag = true;

    this.no_of_notes += 1;
    
    await localStorage.setItem(String(this.no_of_notes),this.showOnScreen);
    // await localStorage.setItem(String(this.no_of_notes)+"h",String(consoler));

    // console.log("number is >> ",this.no_of_notes)
    await localStorage.setItem('number',String(this.no_of_notes));
    // this.showOnScreen = "";
     

    // await this.loadTexts()

  }

  public async loadTexts(){

    
    var i = 1;
    for(i=1;i<=this.no_of_notes;i++){
      this.texts_array[i] = await localStorage.getItem(String(i));
      this.highlights[i] = await localStorage.getItem(String(i)+"h");
      // console.log("loading",this.texts_array[i]);
    }
    this.loadingDone = true;
  }

  public async loadNumberOfNotes(){
    console.log("before loading num  =  ",this.no_of_notes)
    
    this.no_of_notes = parseInt(await localStorage.getItem('number'));
    console.log(localStorage.getItem('number'))
    // console.log(this.no_of_notes <10 )
    // console.log(this.no_of_notes >10 )
    // console.log(this.no_of_notes == 10 )
    if( this.no_of_notes > 10 || this.no_of_notes <10 || this.no_of_notes == 10){
        console.log("iffer")
        // this.no_of_notes -= 1;
      }
      else{
        console.log("elser")
        this.no_of_notes = 0;

      }
      

    // }
    console.log("loading the number of notes",this.no_of_notes);
  }

}

export interface Photo {
  filepath: string;
  webviewPath: string;
}
