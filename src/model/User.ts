import {Injectable} from "@angular/core";
import {Connection} from "./connection";

@Injectable()
export class User{
  private _name: string;
  private _connections: Array<Connection>;
  private _nextId: number;

  constructor(name:string){
    this.name = name;
    this.nextId = 1;
  }

  static fromJSON(data:any): User{
    let newUser = new User(data.name);
    newUser.nextId = data.nextId;
    if(data.connections){
      data.connections.forEach((con: any) => {
        newUser.connections.push(Connection.fromJSON(con));
      })
    }
    return newUser;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get connections(): Array<Connection> {
    return this._connections;
  }

  set connections(value: Array<Connection>) {
    this._connections = value;
  }

  addConnection(homepage: string){
    let newCon = new Connection(this.nextId, homepage);
    this.nextId = this.nextId+1;
    this._connections.push(newCon);
  }

  getConnection(id: number): Connection{
    this.connections.forEach((connection) => {
      if(connection.id == id) return connection;
    });
    throw new Error("Connection does not exist");
  }

  deleteConnection(con: Connection){
    let i = this.connections.indexOf(con);
    if (i == -1) throw new Error("Connection not found");
    else {
      this.connections.splice(i, 1);
    }
  }

  get nextId(): number {
    return this._nextId;
  }

  set nextId(value: number) {
    this._nextId = value;
  }

}
