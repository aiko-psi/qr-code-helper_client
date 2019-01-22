import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";
import {QRRedirect} from "../model/QRRedirect";
import {List} from "ionic-angular";

@Injectable()
export class Http_provider{
  public baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient, private dataProvider: Data_provider){

  }

  public buildHeader(): Promise<HttpHeaders>{
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
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

  // Object.value not possible
  public objectToArray(obj: object):Array<any>{
    let objArray = new Array();
    for (const key of Object.keys(obj)){
      objArray.push(obj[key]);
    }
    return objArray;
  }







}
