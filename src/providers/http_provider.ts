import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";

@Injectable()
export class Http_provider{
  public baseURL: string = "http://localhost:8080/api";

  constructor(private http: HttpClient, private dataProvider: Data_provider){

  }

  public buildHeader(): HttpHeaders{
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    this.dataProvider.getToken().then(token => {
      header.append("Authorization", "Bearer "+ token);
    }).catch(err => {throw new Error("No token available")});
    return header;
  }

  public getUserByNameOrMail(usernameOrEmail: string):Promise<any>{
    const url = this.baseURL + "/auth/user/"+ usernameOrEmail.toString() + "/" + usernameOrEmail.toString();
    return this.http.get(url).toPromise().then(resp =>{
      return resp;
    })
    .catch(err => {throw new Error("No User with this name recieved" + err.toString())});
  }






}
