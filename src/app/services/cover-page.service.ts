import { Injectable } from '@angular/core';

export interface ICoverPageData {
  school_name: string;
  teacher_name: string;
  class: string;
  group_name: string;
  year_year: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})

export class CoverPageService {

 currentYear = new Date().getFullYear();
 schoolYear = `${this.currentYear}-${this.currentYear + 1}`;

  private readonly storageKey = 'coverPageData';
  private defaultData: ICoverPageData = {
    school_name: 'Collège Moderne Bessio De Lambert',
    teacher_name: 'Mme CISSE',
    class: '5ème 1',
    group_name: 'VERT',
    year_year: this.schoolYear,
    color: 'VERT'
  };

  constructor() { 
  }

  // Save data to local storage
  saveData(data: ICoverPageData): void {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(this.storageKey, jsonData);
  }

  // Retrieve data from local storage
  getData(): ICoverPageData {
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Return default data if nothing is found in local storage
    return this.defaultData;
  }

  // Check if data is available in local storage
  isDataAvailable(): boolean {
    return localStorage.getItem(this.storageKey) !== null;
  }

    // Supprimer les données du localStorage
    clearData(): void {
      localStorage.removeItem(this.storageKey);
    }


}
