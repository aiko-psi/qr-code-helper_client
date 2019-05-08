import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {Http_provider} from "./http_provider";
import {User} from "../model/User";
import {HttpClient, HttpHeaders} from "@angular/common/http";

/**
 * Handles all request to the server api that do not need authentication, mainly user related requests
 */
@Injectable()
export class Auth_provider {
  url: String;

  /**
   *
   * @param dataProvider
   * @param http
   * @param httpProv
   */
  constructor(private dataProvider: Data_provider, private http: HttpClient, private httpProv: Http_provider){
    this.url = this.httpProv.baseURL + "/auth";
  }

  /**
   * Build headers for every http request, no token or auth needed here
   * @return Promise resolving to HttpHeaders
   */
  public buildHeader(): HttpHeaders{
    let header= new HttpHeaders();
    header.append("Content-Type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
    return header;
  }

  /**
   * Sends Login request to the server api, then requests user-information from server and saves them in storage
   * @see [[http]]
   * @see [[dataProvider]]
   * @param usernameOrEmail
   * @param password
   * @return Promise which resolves to JSOn with userdata if the process succeeds
   */
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

  /**
   * Sends signup request to the server api, then saves userdata to storage
   * @see [[dataProvider]]
   * @param userRequest
   * @param password
   * @param voucher
   * @return Promise which resolves if process succeeds
   */
  public signup(userRequest: User, password: string, voucher: string){
    const body = userRequest.packForSignup(voucher, password);
    return this.http.post(this.url + "/signup", body, {headers: this.buildHeader()}).toPromise()
      .then(response => {
      return this.dataProvider.setUser(User.fromJSON(response));
    })
  }

  /**
   * Checks if an EMail-Address is already registered on the server
   * @param email
   * @return Promise which resolves if E
   */
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
