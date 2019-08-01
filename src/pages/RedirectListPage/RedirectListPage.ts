import { Component } from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, ToastController} from 'ionic-angular';
import {QRRedirect} from "../../model/QRRedirect";
import {Http_provider} from "../../providers/http_provider";
import {TabsPage} from "../tabs/tabs";
import {RedirectEditPage} from "../RedirectEditPage/RedirectEditPage";

/**
 * View which shows a list of cards with QRRedirects (with or without filter)
 */
@Component({
  selector: 'page-list',
  templateUrl: 'RedirectListPage.html'
})
export class RedirectListPage {
  private qrRedirectArray: Array<QRRedirect> = new Array<QRRedirect>();
  private userFilter: boolean;
  private loading: Loading;

  /**
   *
   * @param navCtrl
   * @param http
   * @param toast
   * @param loadingCtrl
   */
  constructor(public navCtrl: NavController, public http: Http_provider, private toast: ToastController,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
  }

  /**
   * Lifecycle Event: Updates list when entering the view
   */
  ionViewWillEnter(){
    this.update();
  }

  /**
   * Starts updating [[qrRedirectArray]] and therefore the content of the view
   * @see [[load]]
   * @return Promise resolving if loading succeeded
   */
  update(): Promise<any>{
    return this.showLoading()
      .then(()=> {return this.load()})
      .then(() => {this.loading.dismissAll();})
      .catch(err => {
        this.loading.dismissAll();
        this.presentToast("Laden der Daten fehlgeschlagen. " + err.toString());
      })
  }

  /**
   * Requests QRRedirects from server and sets [[qrRedirectArray]]
   * @see [[http]]
   * @return Promise resolving if requests succeeded
   */
  load():Promise<any>{
    let whichRedirect = this.userFilter ? "user": "all";
    return this.http.getRedirects(whichRedirect)
      .then(resp => {
        this.qrRedirectArray = Array.from(resp);
        return this.qrRedirectArray;
      })
  }

  /**
   * Navigates to [[RedirectEditPage]] to show details of QRRedirect and edit it
   * @param redirect selected QRRedirect
   */
  showRedirect(redirect: QRRedirect){
    let id = redirect.id;
    this.navCtrl.push(RedirectEditPage, {redirectId: id});
  }

  /**
   * Refresh view, see documentation for Ionic Native Refresher
   * @param refresher
   */
  doRefresh(refresher) {
    this.update().then(() => {refresher.complete();});
  }

  /**
   * Navigate to [[RedirectEditPage]] to edit the new Redirect
   */
  newRedirect(){
    this.navCtrl.push(RedirectEditPage);
  }

  /**
   * Alert to edit View Options for filtering and sorting the listentries / redirects
   */
  editViewOptions() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Which planets have you visited?');

    alert.addInput({
      type: 'checkbox',
      label: 'Nur eigene Verknüpfungen',
      value: 'userFilter'
    });

    alert.addInput({
      type: 'checkbox',
      label: 'Nach meisten Klicks sortieren (Dummy)',
      value: 'sortStats'
    });

    alert.addButton('Abbrechen');
    alert.addButton({
      text: 'Okay',
      handler: data => {
        console.log('Checkbox data:', data);
        this.userFilter = data.userFilter;
        //do something with sort stats
        //do something else :-P
      }
    });
    alert.present();
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
