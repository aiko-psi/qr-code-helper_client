import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";
import {QRRedirect} from "../model/QRRedirect";
import {QRCode} from "../model/QRCode";

@Injectable()
export class Http_provider{
  public baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient, private dataProvider: Data_provider){

  }

  public buildHeader(): Promise<HttpHeaders>{
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
     return this.dataProvider.getToken().then(token => {
      return header.append("Authorization", "Bearer "+ token);
    });
  }

  public getUserByNameOrMail(usernameOrEmail: string):Promise<any>{
    const url = this.baseURL + "/user/username/"+ usernameOrEmail.toString() + "/" + usernameOrEmail.toString();
    return this.buildHeader()
      .then(header => {
        return this.http.get(url, {headers: header})
          .toPromise();
      }).then(resp => {
        return User.fromJSON(resp);
      })
      .catch(err => {throw new Error("No User with this name recieved" + err.toString())});
  }

  public getRedirects(whichDirects: string): Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrredirects/" + whichDirects, {headers: header})
          .toPromise();
      }).then(resp => {
        let respArray = this.objectToArray(resp);
        return respArray.map(obj => {
          return QRRedirect.fromJSON(obj);
        });
      })
  }

  public getQRCode(qrCodeId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/" + qrCodeId, {headers: header})
          .toPromise();
      }).then(resp => {
        return QRCode.fromJSON(resp);
      })
  }

  // Object.value not possible
  public objectToArray(obj: object):Array<any>{
    let objArray = new Array();
    for (const key of Object.keys(obj)){
      objArray.push(obj[key]);
    }
    return objArray;
  }

  public getCurrentRedirectFromId(redirectId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrredirects/" + redirectId, {headers: header})
          .toPromise();
      }).then(resp => {
          return QRRedirect.fromJSON(resp);
      });
  }

  public isQRCodePossible(qrCodeId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/check/exist/" + qrCodeId, {headers: header})
          .toPromise();
      })
  }

  public isQRinUse(qrCodeId:number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/check/filled/" + qrCodeId, {headers: header})
          .toPromise();
      })
  }

  public getCurrentRedirectFromQRCodeId(qrCodeId: number):Promise<QRRedirect>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/" + qrCodeId, {headers: header})
          .toPromise();
      }).then(resp => {
        return QRRedirect.fromJSON(resp["redirect"])
      });

  }

  // Post

  public postQRRedirect(redirect: QRRedirect){
    return this.buildHeader()
      .then(header => {
        return this.http.post(this.baseURL + "/qrredirects/" + redirect.qrcodeId, redirect.packToRequestBody(),
          {headers: header})
          .toPromise();
      })
  }

  public postQRCodes(count: number){
    return this.buildHeader()
      .then(header => {
        return this.http.post(this.baseURL + "/qrcodes/create?count=" + count.toString(), {},
          {headers: header})
          .toPromise();
      })
  }

  // Put

  public updateQRRedirect(redirect: QRRedirect){
    return this.buildHeader()
      .then(header => {
        return this.http.put(this.baseURL + "/qrredirects/" + redirect.id, redirect.packToRequestBody(),
          {headers: header})
          .toPromise();
      })
  }

  // Check

  public checkUser(user: User): Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/user/username/" + user.username.toString() + "/" + user.email.toString(),
          {headers: header})
          .toPromise()
      })
  }







}
