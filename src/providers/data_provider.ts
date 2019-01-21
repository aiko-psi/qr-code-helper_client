import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import {User} from "../model/User";
import 'rxjs/add/operator/toPromise'

@Injectable()
export class Data_provider{

  constructor(private storage:Storage){
  }

  public getUser(): Promise<User>{
    let user = this.storage.get("user").then(userJSON =>{
      return User.fromJSON(userJSON);
    });
    let token = this.storage.get("token");
    return Promise.all([user,token]).then(response => {return response[0]});
  }

  public setUser(user: User){
    this.storage.set("user", user);
  }

  public setToken(token: String){
    this.storage.set("token", token);
  }

  public getToken(): Promise<String>{
    return this.storage.get("token");
  }




}
