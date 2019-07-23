import {Injectable} from "@angular/core";

@Injectable()
export class Connection{
  private _id: number;
  private _name: string;
  private _location: string;
  private _homepage: string;

  constructor(id:number, homepage:string){
    this.id = id;
    this.homepage = homepage;
  }

  static fromJSON(data:any): Connection{
    let newCon = new Connection(data.id, data.homepage);
    if(data.name){
      newCon.name = data.name;
    }
    if(data.location){
      newCon.location = data.location;
    }
    return newCon;
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

  get location(): string {
    return this._location;
  }

  set location(value: string) {
    this._location = value;
  }

  get homepage(): string {
    return this._homepage;
  }

  set homepage(value: string) {
    this._homepage = value;
  }


}
