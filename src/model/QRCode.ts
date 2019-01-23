import {Injectable} from "@angular/core";
import {QRRedirect} from "./QRRedirect";

@Injectable()
export class QRCode{
  private _id: number;
  private _redirectId: number;
  private _redirect: QRRedirect;

  constructor(){

  }

  static fromJSON(data:any){
    let newCode = new QRCode();
    newCode.id = data.id;
    if(data.redirectId){newCode.redirectId = data.redirectId;}
    if(data.redirect){newCode.redirect = QRRedirect.fromJSON(data.redirect);}
    return newCode;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get redirectId(): number {
    return this._redirectId;
  }

  set redirectId(value: number) {
    this._redirectId = value;
  }

  get redirect(): QRRedirect {
    return this._redirect;
  }

  set redirect(value: QRRedirect) {
    this._redirect = value;
  }
}
