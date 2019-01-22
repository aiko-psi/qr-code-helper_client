import {Component, ViewChild} from "@angular/core";
import {Http_provider} from "../../providers/http_provider";
import {Auth_provider} from "../../providers/auth_provider";
import {User} from "../../model/User";
import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {Data_provider} from "../../providers/data_provider";
import {TabsPage} from "../tabs/tabs";
import {LoginPage} from "../LoginPage/login-page";

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

  constructor(private http: Http_provider, private auth: Auth_provider, public loadingCtrl: LoadingController,
              public toast: ToastController, private data: Data_provider, public navCtrl: NavController){
    this.userRequest = new User();
  }


  signup(){
    this.showLoading().then(() => {
      return this.auth.signup(this.userRequest, this.password, this.voucher)
    }).catch(err => {
      this.loading.dismissAll();
      this.presentFailiureToast(err);
    }).then(() => {
      return this.auth.login(this.userRequest.username, this.password)
    }).catch((err) => {
      this.loading.dismissAll();
      this.navCtrl.pop();
    }).then(resp => {
      return this.http.getUserByNameOrMail(this.userRequest.username)
    }).then(resp => {
      let user = User.fromJSON(resp);
      this.data.setUser(user);
      this.loading.dismissAll();
      this.navCtrl.setRoot(TabsPage, {user: user, tab: 0});
    }).catch(err => {
      this.loading.dismissAll();
      this.presentToast("Fehlgeschlagen");
    })

  }

  checkMail(){
    this.auth.checkEmail(this.userRequest.email).then(resp => {
      if (resp){
        this.presentToast("E-Mail-Adresse schon genutzt!");
      }
    })
  }

  checkUsername(){
    this.auth.checkUsername(this.userRequest.username).then(resp => {
      if (resp){
        this.presentToast("Nutzername schon vergeben!");
      }
    })

  }

  login(){
    this.navCtrl.push(LoginPage);
  }

  presentFailiureToast(err: String){
    let toast = this.toast.create({
      message: "Registrierung fehlgeschlagen" + err,
      showCloseButton: true,
      closeButtonText: "okay",
      position: "middle"
    });
    toast.present();
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
