import {Http_provider} from "../../providers/http_provider";
import {Loading, LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Component} from "@angular/core";

@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner-page.html'
})
export class ScannerPage {
  private loading: Loading;
  private scanSub;

  constructor(public navCtrl: NavController, private toast: ToastController, private loadingCtrl: LoadingController,
              private navParams: NavParams , private http: Http_provider, private qrScanner: QRScanner) {


  }

  ionViewDidLoad(){
    this.readQRCode();
  }

  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
  }


  readQRCode() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted
          console.log('granted, start scanning');

          this.qrScanner.show();

          // start scanning
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);
            this.popResult(text);

            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning

          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.presentToast("Zugriff auf die Kamera nicht erlaubt");
          this.popEmpty();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          this.presentToast("Wenn Sie die den Zugriff zur Kamera nicht erlauben, können Sie die App nicht nutzen.")
          this.popEmpty();
        }
      })
      .catch((e: any) => {
        console.log('Error is', e);
        this.presentToast("Fehler beim Lesen des QR-Codes aufgetreten.");
        this.popEmpty();
      });
  }

  popEmpty(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
    this.navCtrl.getPrevious().data.scanResult = null;
    this.navCtrl.getPrevious().data.scanning = true;
    this.navCtrl.pop();

  }

  popResult(result: string){
    this.navCtrl.getPrevious().data.scanResult = result;
    this.navCtrl.getPrevious().data.scanning = true;
    this.navCtrl.pop();
  }


  presentToast(message: string){
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }

}
