import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {Http_provider} from "./http_provider";
import {User} from "../model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class Auth_provider {
  url: String;

  constructor(private dataProvider: Data_provider, private http: HttpClient, private httpProv: Http_provider){
    this.url = this.httpProv.baseURL + "/auth";
  }

  public buildHeader(): HttpHeaders{
    let header= new HttpHeaders();
    header.append("Content-Type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    return header;
  }

  public login(usernameOrEmail: string, password: string): Promise<any>{
    const body = {"usernameOrEmail": usernameOrEmail, "password": password};
    return this.http.post(this.url + "/signin", body, {headers: this.buildHeader()}).toPromise()
      .then((response)=> {
        this.dataProvider.setToken(response["accessToken"]);
        return response;
    }).then(response => {
      return this.httpProv.getUserByNameOrMail(usernameOrEmail);
      }).then(resp => {
        this.dataProvider.setUser(User.fromJSON(resp));
        return resp;
      }).catch(err => {throw new Error("Login unsuccessfull")});
  }

  public signup(userRequest: User, password: string, voucher: string){
    const body = userRequest.packForSignup(voucher, password);
    return this.http.post(this.url + "/signup", body, {headers: this.buildHeader()}).toPromise()
      .then(response => {
      return this.dataProvider.setUser(User.fromJSON(response));
    })
  }

  public checkEmail(email: string): Promise<any>{
    return this.http.get(this.url + "/check/email/" + email.toString(),
      {headers: this.buildHeader()}).toPromise();
  }

  public checkUsername(username: string): Promise<any>{
    return this.http.get(this.url + "/check/username/" + username.toString(),
      {headers: this.buildHeader()}).toPromise();
  }

  public logout(): Promise<any>{
    return this.dataProvider.clearAll();
  }


}
