import { Component } from '@angular/core';
import {AlertController, NavController, Platform} from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {Http_provider} from "../../providers/http_provider";
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';
import {AndroidPermissions} from "@ionic-native/android-permissions";

/**
 * View which allows the user to create new QRCodes
 */
@Component({
  selector: 'page-print',
  templateUrl: 'QRCodeHelperPrint.html'
})
export class QRCodeHelperPrint {
  mailing: boolean;
  count: number;
  idlist: Array<number>;
  addressList: Array<string>;
  firstElement: string;

  /**
   * Constructor, set default values for some attributes
   * @param navCtrl
   * @param toastCtrl
   * @param http
   * @param platform
   * @param alertCtrl
   * @param base64ToGallery
   * @param androidPermissions
   */
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private http: Http_provider,
              private platform: Platform, public alertCtrl: AlertController, private base64ToGallery: Base64ToGallery,
              private androidPermissions: AndroidPermissions){
    this.count = 1;
    this.mailing = false;
    this.addressList = new Array<string>();
  }

  ionViewWillEnter() {

  }

  /**
   * Starts creation of QRCodes (triggered from [[showAddPrompt]])
   * @see [[getListOfQRCodes]]
   * @see [[addToList]]
   */
  createQRCode(){
    this.clearLists();
    this.getListOfQRCodes()
      .then(() => {
        return this.addToList();
      })
      .catch(() => {
        this.presentToast("Leider nicht möglich!");
      })
  }

  /**
   * Requests a list of newly created QRCodeIds from the server
   * @see [[http]]
   */
  getListOfQRCodes(){
    return this.http.postQRCodes(this.count)
      .then(resp => {
        this.idlist = resp;
      })
  }

  /**
   * Iterates over [[idlist]] and creates a string/URL for each entry, sets [[firstElement]]
   * @see [[addressList]]
   */
  addToList(){
    for (let num of this.idlist){
      this.addressList.push(this.buildQRCodeAddress(num));
    }
    this.firstElement = this.addressList[0];
  }

  /**
   * Creates a string representing the URL for the newly created QRCOde
   * @param num QRCodeId from [[idlist]]
   * @return string representing the URL of the QRCode
   */
  buildQRCodeAddress(num: number){
    let base = this.http.baseURL.includes("/api") ?
      this.http.baseURL.replace("/api", "") :
      this.http.baseURL ;
    return base + "/qrcodehelper/qrredirect/" + num.toString();
  }

  /**
   * Clears [[idlist]] and [[addressList]]
   */
  clearLists(){
    this.addressList = new Array<string>();
    this.idlist = new Array<number>();
  }

  /**
   * Saves the QR-Codes as pictures in the Gallery
   * Checks if the Permission is granted for Android Device
   * Uses ionic-native base64ToGallery module
   * Uses invisible canvas -> base64 -> Gallery
   */
  saveFilesToGallery() {
    let canvasList = document.querySelectorAll('canvas');
    if (canvasList.length >= 1){
      for (var i = 0; i < canvasList.length; i++){
        let canvas = canvasList[i];
        let base64Data = canvas.toDataURL();
        this.base64ToGallery.base64ToGallery(base64Data).then(
          res => {
            console.log('Saved image to gallery ', res);
            this.presentToast("Bild in der Gallerie abgespeichert.")
          },
          err => {
            console.log('Error saving image to gallery ', err);
            this.presentToast("Speichern nicht möglich.")
          }
        );
      }
    } else {
      this.presentToast("Speichern nicht möglich, kein QR-Code gefunden!")
    }
  }

  /**
   * Checks on which platform the app is running,
   * then checks if the permissions for saving an image in the gallery are granted
   * @see {{saveFilesToGallery}}
   */
  checkGalleryPermissions(){
    if (this.platform.is("android")){
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          console.log(result);
          if (result.hasPermission == true) this.saveFilesToGallery();
          else {
            this.presentToast("Bitte Berechtigung erteilen und erneut versuchen!");
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
          }
        },
        err => {
          console.log(err);
          this.presentToast("Speichern fehlgeschlagen, Fehler in Berechtigungen.");
        }
      );
    } else if (this.platform.is("ios")){
      // Hoping the permissions are already granted, check this when ios device is available for testing
      this.saveFilesToGallery()
    } else {
      this.presentToast("Speichern des Bildes ist momentan nur unter Android oder iOS möglich.")
      // TODO saving image out of the browser (js tools?)
    }
  }

  /**
   * Shows Prompt to user to manage creation of new QRCodes, asks for count of QRCodes to be created
   * @see [[count]]
   * @see [[createQRCode]]
   */
  showAddPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'QR-Codes erstellen',
      message: "Wie viele QR-Codes möchten Sie erstellen?",
      inputs: [
        {
          name: 'count',
          placeholder: ' '
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Erstellen',
          handler: data => {
            this.count = data.count;
            this.createQRCode();
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Shows Prompt to manage re-creation of already existing QRCodes (not yet implemented)
   */
  showRepeatPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'QR-Codes neu drucken',
      message: "Wenn Sie einen schon bestehenden QR-Code neu generieren möchten, können Sie hier dessen ID eingeben:",
      inputs: [
        {
          name: 'id',
          placeholder: 'ID'
        },
      ],
      buttons: [
        {
          text: 'Abbrechen',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Neu generieren',
          handler: data => {
            // TODO
          }
        }
      ]
    });
    prompt.present();
  }

  /**
   * Presents message to the user
   * @param text
   */
  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000,
      position: 'top'
    });
    toast.present();
  }


}

