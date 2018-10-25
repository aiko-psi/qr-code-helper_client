import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-print',
  templateUrl: 'QRCodeHelperPrint.html'
})
export class QRCodeHelperPrint {
  mailing: boolean;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController) {
    this.mailing = false;

  }

  presentToast() {
    var text = this.mailing ? "Jetzt würde eine E-Mail gesendet." : "Jetzt würde der Dialog zum Speichern aufgehen";

    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });


    toast.present();
  }


}

