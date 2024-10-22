import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  private characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // List of font families to choose from
  private fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Verdana, sans-serif',
    'Georgia, serif',
    'Palatino, serif',
    'Garamond, serif',
    'Bookman, serif',
    'Trebuchet MS, sans-serif',
    'Arial Black, sans-serif'
    // Add more font families as needed
  ];

  constructor() { }

  generateCaptchaWithStyle(length: number): { text: string, style: any } {
    const captcha = this.generateCaptcha(length);
    const backgroundColor = this.getRandomColorExcludingBlack(); // Random background color excluding black
    const textColor = this.getContrastColor(backgroundColor); // Get contrasting text color

    const style = {
      'color': textColor,
      'background-color': backgroundColor,
      'font-family': this.getRandomFontFamily(), // Random font family
      'font-size': `${this.getRandomFontSize()}px`
    };
    return { text: captcha, style: style };
  }

  getRandomColorExcludingBlack(): string {
    let color;
    do {
      color = this.getRandomColor();
    } while (color === '#000000'); // Exclude black color
    return color;
  }

  getContrastColor(hexColor: string): string {
    // Calculate luminance of the color
    const rgb = this.hexToRgb(hexColor);
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

    // Use white text for dark backgrounds, and black text for light backgrounds
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  hexToRgb(hex: string): { r: number, g: number, b: number } {
    // Remove '#' from hex string
    hex = hex.replace('#', '');
    // Convert hex to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  private generateCaptcha(length: number): string {
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
    }
    return captcha;
  }

  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  private getRandomFontFamily(): string {
    const index = Math.floor(Math.random() * this.fontFamilies.length);
    return this.fontFamilies[index];
  }

  private getRandomFontSize(): number {
    return Math.floor(Math.random() * 6) + 16; // Font size between 16 and 21 pixels
  }
}
