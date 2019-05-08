import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {Http_provider} from "../../providers/http_provider";
import {Data_provider} from "../../providers/data_provider";
import {Component} from "@angular/core";
import {Auth_provider} from "../../providers/auth_provider";
import {SignupPage} from "../SignupPage/signup-page";
import {TabsPage} from "../tabs/tabs";

/**
 * Login View
 */
@Component({
  selector: "page-login",
  templateUrl: "login-page.html"
})
export class LoginPage {
  private usernameOrEmail: string;
  private password: string;
  private loading: Loading;

  /**
   *
   * @param navCtrl
   * @param http
   * @param data
   * @param auth
   * @param loadingCtrl
   * @param toast
   */
  constructor( private navCtrl: NavController, private http: Http_provider, private data: Data_provider,
               private auth: Auth_provider, public loadingCtrl: LoadingController, public toast: ToastController){

  }

  /**
   * Lifecycle Event: Tries reading existing userdata from the storage and login automatically when view enters
   * @see [[data]]
   */
  ionViewWillEnter(){
    this.showLoading().then(() => {
      // try reading userdata out of storage
      return this.data.getUser();
    })
      .then(user => {
        // if userdata is available, check if userdata and token are valid
        return this.http.checkUser(user);
      })
      .then(user =>{
        // if userdata is valid, proceed to main-app
        this.loading.dismissAll();
        this.navCtrl.setRoot(TabsPage, {user: user, tab: 0});
      })
      .catch(err => {
        // something went wrong, just show login again
        //this.data.clearAll();
        this.loading.dismissAll();
      });
  }

  /**
   * Logs the user in with form data; handle errors
   * @see [[usernameOrEmail]]
   * @see [[password]]
   * @see [[auth]]
   */
  login(){
    this.showLoading().then(() =>{
      // try login with form-data
      return this.auth.login(this.usernameOrEmail, this.password);
    }).then(response => {
      // if login worked, proceed to main-app
      this.loading.dismissAll();
      this.navCtrl.setRoot(TabsPage, {user: response, tab: 0});
    }).catch(err => {
      // if login failed, show error and show login again
      this.loading.dismissAll();
      this.presentToast("Login fehlgeschlagen! " + err.toString());
    })
  }

  /**
   * Navigates to [[SignupPage]]
   */
  register(){
    this.navCtrl.push(SignupPage);
  }

  /**
   * Presents message to user
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
   * Shows loading screen
   */
  showLoading(){
    this.loading = this.loadingCtrl.create({
      content: "Bitte warten..."
    });
    return this.loading.present();
  }

}
