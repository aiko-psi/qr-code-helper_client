import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import {User} from "../model/User";
import 'rxjs/add/operator/toPromise'

/**
 * Handels all storage operations, mostly used for storing authentification information in storage
 * See Ionic Native Storage for more information
 */
@Injectable()
export class Data_provider{

  /**
   *
   * @param storage
   */
  constructor(private storage:Storage){
  }

  /**
   * Gets user information from storage if possible
   * @return Promise resolving to User object if both userinfo and token are in storage
   */
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

  /**
   * Sets user in storage
   * @param user
   */
  public setUser(user: User): Promise<any>{
    return this.storage.set('user', user.toJSON());
  }

  /**
   * Sets token in Storage
   * @param token
   */
  public setToken(token: String): Promise<any>{
    return this.storage.set('token', token);
  }

  /**
   * Gets token from storage
   */
  public getToken(): Promise<String>{
    return this.storage.get('token');
  }

  /**
   * Clears storage
   */
  public clearAll(): Promise<any>{
    return this.storage.clear();
  }




}
