import {Http_provider} from "../../providers/http_provider";
import {Loading, LoadingController, NavController, NavParams, ToastController} from "ionic-angular";
import {QRScanner, QRScannerStatus} from "@ionic-native/qr-scanner";
import {Component} from "@angular/core";

/**
 * View to scan QRCodes with the camera, possible only with cordova
 */
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner-page.html'
})
export class ScannerPage {
  private loading: Loading;
  private scanSub;

  /**
   *
   * @param navCtrl
   * @param toast
   * @param loadingCtrl
   * @param navParams
   * @param http
   * @param qrScanner
   */
  constructor(public navCtrl: NavController, private toast: ToastController, private loadingCtrl: LoadingController,
              private navParams: NavParams , private http: Http_provider, private qrScanner: QRScanner) {

  }

  /**
   * Lifecycle event: Starts reading QRCodes when entering the page
   * @see [[readQRCode]]
   */
  ionViewDidLoad(){
    this.readQRCode();
  }

  /**
   * Lifecycle event: Hides cameraview and unsubscribes when leaving the view
   */
  ionViewWillLeave(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
  }


  /**
   * Reads the QRCOde, see documentation of the Ionic Native QR Scanner
   */
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

  /**
   * Ends Scanning and pops view, sets result value to null
   */
  popEmpty(){
    this.qrScanner.hide(); // hide camera preview
    this.scanSub.unsubscribe(); // stop scanning
    this.navCtrl.getPrevious().data.scanResult = null;
    this.navCtrl.getPrevious().data.scanning = true;
    this.navCtrl.pop();

  }

  /**
   * Ends scanning, sets result value of the prevoius view to the current result, then pops current view
   * @param result URL of the QRCode
   */
  popResult(result: string){
    this.navCtrl.getPrevious().data.scanResult = result;
    this.navCtrl.getPrevious().data.scanning = true;
    this.navCtrl.pop();
  }


  /**
   * Present message to user
   * @param message
   */
  presentToast(message: string){
    let toast = this.toast.create({
      message: message,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  /**
   * Show loading screen
   */
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }

}
