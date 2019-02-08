import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import {User} from "../model/User";
import 'rxjs/add/operator/toPromise'

@Injectable()
export class Data_provider{

  constructor(private storage:Storage){
  }

  public getUser(): Promise<User>{
    let user = this.storage.get('user')
      .then(userJSON =>{
        console.log(userJSON);
        return User.fromJSON(JSON.parse(userJSON));
    });
    let token = this.storage.get('token');
    let both = [user, token];
    return Promise.all(both)
      .then((response) => {
        console.log(typeof response[0]);
        return response[0]
      });
  }

  public setUser(user: User): Promise<any>{
    return this.storage.set('user', user.toJSON());
  }

  public setToken(token: String): Promise<any>{
    return this.storage.set('token', token);
  }

  public getToken(): Promise<String>{
    return this.storage.get('token');
  }

  public clearAll(): Promise<any>{
    return this.storage.clear();
  }




}
