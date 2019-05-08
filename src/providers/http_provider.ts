import {Injectable} from "@angular/core";
import {Data_provider} from "./data_provider";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../model/User";
import {QRRedirect} from "../model/QRRedirect";
import {QRCode} from "../model/QRCode";

/**
 * Handles all requests to the server api which require beeing login (require a token)
 */
@Injectable()
export class Http_provider{
  // Basic URL for Server-Api, set here for the entire application
  public readonly baseURL: string = "http://141.51.193.191:8080/api";

  constructor(private http: HttpClient, private dataProvider: Data_provider){
  }

  /**
   * Builds the header for each request, including the token
   * @return Promise resolving to a HttpHeaders
   */
  public buildHeader(): Promise<HttpHeaders>{
    const header = new HttpHeaders();
    header.append("Content-Type", "application/json");
    header.append("Access-Control-Allow-Origin", "*");
     return this.dataProvider.getToken().then(token => {
      return header.append("Authorization", "Bearer "+ token);
    });
  }

  /**
   * Requests the user details from the server for login users
   * @param usernameOrEmail Username or Email-Address for the required user
   * @return Promise resolving to a User object
   */
  public getUserByNameOrMail(usernameOrEmail: string):Promise<any>{
    const url = this.baseURL + "/user/username/"+ usernameOrEmail.toString() + "/" + usernameOrEmail.toString();
    return this.buildHeader()
      .then(header => {
        return this.http.get(url, {headers: header})
          .toPromise();
      }).then(resp => {
        return User.fromJSON(resp);
      })
      .catch(err => {throw new Error("No User with this name recieved" + err.toString())});
  }

  /**
   * Requests a list of QRRedirect Entries (full list or user-specific list) using [[objectToArray]]
   * @param whichDirects string which can be all or user, determining if a filtered list should be requested
   * @return Promise resolving to to an array of QRRedirect objects
   * @see objectToArray
   */
  public getRedirects(whichDirects: string): Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrredirects/" + whichDirects, {headers: header})
          .toPromise();
      }).then(resp => {
        let respArray = this.objectToArray(resp);
        return respArray.map(obj => {
          return QRRedirect.fromJSON(obj);
        });
      })
  }

  /**
   * Requests data of one specific QRcode from the server
   * @param qrCodeId Id-Number of the requested QRCode
   * @return Promise resolving to a QRCode object
   */
  public getQRCode(qrCodeId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/" + qrCodeId, {headers: header})
          .toPromise();
      }).then(resp => {
        return QRCode.fromJSON(resp);
      })
  }

  /**
   * Helper-function: Converts a JSON Object containing a list into an array used by [[getRedirects]]
   * @param obj JSON object containing a list
   * @return Array of objects
   */
  public objectToArray(obj: object):Array<any>{
    let objArray = new Array();
    for (const key of Object.keys(obj)){
      objArray.push(obj[key]);
    }
    return objArray;
  }

  /**
   * Requests data from one specific QRRedirect from the server
   * @param redirectId Id-number of the requested QRRedirect
   * @return Promise resolving to QRRedirect object
   */
  public getCurrentRedirectFromId(redirectId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrredirects/" + redirectId, {headers: header})
          .toPromise();
      }).then(resp => {
          return QRRedirect.fromJSON(resp);
      });
  }

  /**
   * Checks if the given QRCodeId is registered on the server
   * @param qrCodeId Id-number of the QRCode
   * @return Promise which resolves to true if the QRCode is registered and rejects if it is not registered
   * additionalInfo: If the QRCodeId is not registered on the server, it is not possible to create a QRRedirect
   */
  public isQRCodePossible(qrCodeId: number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/check/exist/" + qrCodeId, {headers: header})
          .toPromise();
      })
  }

  /**
   * Checks if the QRCode with the given QRCodeId is already matched to an QRRedirect
   * @param qrCodeId Id-number of the QRCode
   * @return Promise which resolves to true if the QRCode is already matched to an QRRedirect and  rejects if not
   */
  public isQRinUse(qrCodeId:number):Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/check/filled/" + qrCodeId, {headers: header})
          .toPromise();
      })
  }

  /**
   * Requests the data of the QRRedirect matching a specific QRCodeId from the server
   * @param qrCodeId Id-number of the QRCode in question
   * @return Promise resolving to QRRedirect object
   */
  public getCurrentRedirectFromQRCodeId(qrCodeId: number):Promise<QRRedirect>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/qrcodes/" + qrCodeId, {headers: header})
          .toPromise();
      }).then(resp => {
        return QRRedirect.fromJSON(resp["redirect"])
      });

  }

  // Post

  /**
   * Posts a new QRRedirect to the server
   * @param redirect QRRedirect to be posted
   * @return Promise resolving if the post request was successful
   */
  public postQRRedirect(redirect: QRRedirect){
    return this.buildHeader()
      .then(header => {
        return this.http.post(this.baseURL + "/qrredirects/" + redirect.qrcodeId, redirect.packToRequestBody(),
          {headers: header})
          .toPromise();
      })
  }

  /**
   * Posts a request to the server to create a specific number of QRCodeIds
   * @param count number of QRCOdeIds to be created on the server
   * @return Promise resolving to an Array of numbers
   */
  public postQRCodes(count: number): Promise<Array<number>>{
    return this.buildHeader()
      .then(header => {
        return this.http.post(this.baseURL + "/qrcodes/create?count=" + count.toString(), {},
          {headers: header})
          .toPromise();
      })
      .then(resp => {
        return resp["qrCodeIdList"];
      })
  }

  // Put

  /**
   * Updates existing QRRedirect on the server
   * @param redirect QRRedirect which is updated
   * @return Promise which resolves if the update request was successful
   */
  public updateQRRedirect(redirect: QRRedirect){
    return this.buildHeader()
      .then(header => {
        return this.http.put(this.baseURL + "/qrredirects/" + redirect.id, redirect.packToRequestBody(),
          {headers: header})
          .toPromise();
      })
  }

  // Check

  /**
   * Checks if userdata is valid
   * @param user User to be tested, with EMail-Address and Username
   * @return Promise which resolves if Username, EMail-Address and used token are valid
   */
  public checkUser(user: User): Promise<any>{
    return this.buildHeader()
      .then(header => {
        return this.http.get(this.baseURL + "/user/username/" + user.username.toString() + "/" + user.email.toString(),
          {headers: header})
          .toPromise()
      })
  }







}
