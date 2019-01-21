import {Loading, LoadingController, NavController, ToastController} from "ionic-angular";
import {Http_provider} from "../../providers/http_provider";
import {Data_provider} from "../../providers/data_provider";
import {HomePage} from "../home/home";
import {Component} from "@angular/core";
import {Auth_provider} from "../../providers/auth_provider";
import {SignupPage} from "../SignupPage/signup-page";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: "page-login",
  templateUrl: "login-page.html"
})
export class LoginPage {
  private usernameOrEmail: string;
  private password: string;
  private loading: Loading;

  constructor( private navCtrl: NavController, private http: Http_provider, private data: Data_provider,
               private auth: Auth_provider, public loadingCtrl: LoadingController, public toast: ToastController){

  }

  ionViewWillEnter(){
    this.showLoading().then(() => {
      return this.data.getUser();
    }).then(user =>{
      this.loading.dismissAll();
      this.navCtrl.setRoot(TabsPage, {user: user, tab: 0});
    }).catch(err => {
      this.loading.dismissAll();
    })
  }

  login(){
    this.showLoading().then(() =>{
      return this.auth.login(this.usernameOrEmail, this.password);
    }).then(response => {
      this.loading.dismissAll();
      this.navCtrl.setRoot(TabsPage, {user: response, tab: 0});
    }).catch(err => {
      this.loading.dismissAll();
      this.presentToast("Login fehlgeschlagen! " + err.toString());
    })
  }

  register(){
    this.navCtrl.push(SignupPage);
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
