import {Injectable} from "@angular/core";

@Injectable()
export class User{
  private _id: number;
  private _name: string;
  private _username: string;
  private _email: string;


  constructor(){

  }

  static fromJSON(data:any): User{
    let newUser = new User();
    newUser.name = data.name;
    newUser.username = data.username;
    newUser.email = data.email;
    newUser.id = data.id;
    return newUser;
  }

  toJSON(){
    let res = {};
    for (const key of Object.keys(this).filter((x) => x != "id" && x[0] === "_")){
      res[key.substr(1)]= this[key]
    }
    return JSON.stringify(res);
  }

  packForSignup(voucher: string, password: string){
    let res = {};
    for (const key of Object.keys(this).filter((x) => x != "id" && x[0] === "_")){
      res[key.substr(1)]= this[key]
    }
    if (voucher) {res["voucher"]= voucher;}
    if (password) {res["password"]= password;}
    let resp = (voucher && password) ? res : JSON.stringify(res);
    return resp;

  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}
