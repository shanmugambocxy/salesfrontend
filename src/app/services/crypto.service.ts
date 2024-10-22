import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = environment.encKey;

  constructor() { }

  // Encrypt data using AES encryption
  encrypt(data: any): string {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(JSON.stringify(data)),
      CryptoJS.enc.Utf8.parse(this.secretKey),
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7 // Specify PKCS7 padding explicitly
      }
    );
    return encrypted.toString();
  }

  // Decrypt data using AES decryption
  decrypt(encryptedData: string): any {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(this.secretKey), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7 // Use PKCS7 padding
    });
    const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  }

}
