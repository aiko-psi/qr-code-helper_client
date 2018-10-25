import {Injectable} from "@angular/core";
import { Storage } from '@ionic/storage';
import {User} from "../model/User";

@Injectable()
export class Data_provider{
  private user: User;

  constructor(private storage:Storage){
    this.storage.length().then((length) => {
      if(length >0) this.newUser();
      else this.readUser();
    })

  }

  newUser(){
    this.user = new User("default");
  }

  readUser(){

  }


}
