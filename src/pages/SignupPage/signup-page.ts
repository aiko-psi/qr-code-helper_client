import {Component, ViewChild} from "@angular/core";
import {Http_provider} from "../../providers/http_provider";
import {Auth_provider} from "../../providers/auth_provider";
import {User} from "../../model/User";
import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {Data_provider} from "../../providers/data_provider";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../LoginPage/login-page";

/**
 * View to signup new Users
 */
@Component({
  selector: "page-signup",
  templateUrl: "signup-page.html"
})
export class SignupPage {
  private userRequest: User;
  private password: string;
  private voucher: string;
  private loading: Loading;

  @ViewChild("registerform") registerform: HTMLFormElement;

  /**
   *
   * @param http
   * @param auth
   * @param loadingCtrl
   * @param toast
   * @param data
   * @param navCtrl
   */
  constructor(private http: Http_provider, private auth: Auth_provider, public loadingCtrl: LoadingController,
              public toast: ToastController, private data: Data_provider, public navCtrl: NavController){
    this.userRequest = new User();
  }

  /**
   * Starts Signup Process, handles Errors and pushing result to be saved in storage
   * @see [[userRequest]] signup-data from signup-form
   * @see [[password]] user password from signup-form
   * @see [[voucher]] voucher for user registration (from form)
   * @see [[presentToast]]
   * @see [[auth]]
   * @see [[loading]]
   */
  signup(){
    this.showLoading().then(() => {
      // requests signup
      return this.auth.signup(this.userRequest, this.password, this.voucher)
    }).catch(err => {
      // signup failed, presents error
      this.loading.dismissAll();
      this.presentFailiureToast(err);
    }).then(() => {
      // after signup, logs in the user automatically
      return this.auth.login(this.userRequest.username, this.password)
    }).catch((err) => {
      // throws error if login fails
      this.loading.dismissAll();
      this.navCtrl.pop();
    }).then(resp => {
      // after login of user, gets user details from server for later use
      return this.http.getUserByNameOrMail(this.userRequest.username)
    }).then(resp => {
      // parsse user details into user object, then proceeds to main app
      let user = User.fromJSON(resp);
      this.data.setUser(user);
      this.loading.dismissAll();
      this.navCtrl.setRoot(TabsPage, {user: user, tab: 0});
    }).catch(err => {
      // process failed, throws error
      this.loading.dismissAll();
      this.presentToast("Fehlgeschlagen");
    })

  }

  /**
   * Checks Email-Address while typing, if address already exists on server, present error
   * @see [[userRequest]] EMail-Address of user
   * @see [[presentToast]]
   */
  checkMail(){
    // TODO: mark field red if address already exists
    this.auth.checkEmail(this.userRequest.email).then(resp => {
      if (resp){
        this.presentToast("E-Mail-Adresse schon genutzt!");
      }
    })
  }

  /**
   * Checks Username while typing, if username already exists on server, present error
   */
  checkUsername(){
    // TODO: mark field red if username already exists
    // TODO: add hints for username length, capital letters, ...
    this.auth.checkUsername(this.userRequest.username).then(resp => {
      if (resp){
        this.presentToast("Nutzername schon vergeben!");
      }
    })
  }

  /**
   * Navigates to Login Page
   */
  login(){
    this.navCtrl.push(LoginPage);
  }

  /**
   * Presents error to the user
   * @param err
   */
  presentFailiureToast(err: string){
    // TODO: Better error messages
    let toast = this.toast.create({
      message: "Registrierung fehlgeschlagen" + err,
      showCloseButton: true,
      closeButtonText: "okay",
      position: "middle"
    });
    toast.present();
  }

  /**
   * Presents message to the user
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
