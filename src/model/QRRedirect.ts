import {Injectable} from "@angular/core";
import {QRCode} from "./QRCode";

@Injectable()
export class QRRedirect{
  private _id: number;
  private _titel: string;
  private _location: string;
  private _address: string;
  private _ownerId: number;
  private _open: boolean;
  private _qrCodeId: number;
  private _qrcode: QRCode;

  constructor(titel:string, address:string, open:boolean, ownerId:number){
    this.titel = titel;
    this.address = address;
    this.open = open;
    this.ownerId = ownerId;
  }

  static fromJSON(data:any){
    let newRedirect = new QRRedirect(data.titel, data.address, data.open, data.ownerId);
    newRedirect.id = data.id;
    if(data.location){newRedirect.location = data.location;}
    if(data.qrCodeId){newRedirect.qrcodeId = data.qrCodeId;}
    if(data.qrCode){QRCode.fromJSON(data.qrCode);}
    return newRedirect;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get titel(): string {
    return this._titel;
  }

  set titel(value: string) {
    this._titel = value;
  }

  get location(): string {
    return this._location;
  }

  set location(value: string) {
    this._location = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get ownerId(): number {
    return this._ownerId;
  }

  set ownerId(value: number) {
    this._ownerId = value;
  }

  get open(): boolean {
    return this._open;
  }

  set open(value: boolean) {
    this._open = value;
  }

  get qrcodeId(): number {
    return this._qrCodeId;
  }

  set qrcodeId(value: number) {
    this._qrCodeId = value;
  }

  get qrcode(): QRCode {
    return this._qrcode;
  }

  set qrcode(value: QRCode) {
    this._qrcode = value;
  }
}
