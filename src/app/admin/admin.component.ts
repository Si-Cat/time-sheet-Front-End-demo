import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  parentData: string = "Admin";
  userIsAdmin: boolean = true;
  userEmail: string = '';
  startOfWeekDate: string = '';
  week: number = 30;

  fullNameControl = new FormControl();
  allNames: string[] = []; // List of all names fetched from the server
  filteredNames: string[] = [];
  selectedFullName: string = '';
  showDropdown: boolean = false;

  private baseUrl = 'http://localhost:8080/employee'; // Update with your actual backend URL

  constructor(private http: HttpClient, private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.setDefaultWeek();
    this.updateStartOfWeekDate();
    this.fetchFullNames();
    this.fullNameControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNames(value))
    ).subscribe(filteredNames => {
      this.filteredNames = filteredNames;
      this.showDropdown = filteredNames.length > 0 && this.fullNameControl.value; // Only show dropdown when there are filtered names and the input is not empty
      console.log('Filtered names:', this.filteredNames); // Log filtered names
    });
  }

  setDefaultWeek() {
    const today = new Date();
    this.week = this.getWeekNumber(today);
  }

  updateStartOfWeekDate() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const firstMonday = this.getNearestMonday(firstDayOfYear);
    const days = (this.week - 1) * 7;
    const firstDayOfWeek = new Date(firstMonday.setDate(firstMonday.getDate() + days));
    this.startOfWeekDate = firstDayOfWeek.toISOString().split('T')[0];
  }

  getWeekNumber(d: Date): number {
    const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
    const firstMonday = this.getNearestMonday(firstDayOfYear);
    const numberOfDays = Math.floor((d.getTime() - firstMonday.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + 1) / 7);
  }

  getNearestMonday(date: Date): Date {
    const day = date.getDay();
    const diff = (day >= 1) ? (1 - day) : -6; // Adjust to get the nearest Monday
    return new Date(date.setDate(date.getDate() + diff));
  }

  fetchFullNames() {
    this.http.get<string[]>(`${this.baseUrl}/names`).subscribe(names => {
      console.log('Fetched names:', names); // Log fetched names
      this.allNames = names;
      this.filteredNames = names; // Initialize filtered names with all names
    });
  }

  private _filterNames(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allNames.filter(name => name.toLowerCase().includes(filterValue));
  }

  onFullNameSelected(name: string) {
    this.selectedFullName = name;
    this.fullNameControl.setValue(name, { emitEvent: false });
    this.showDropdown = false; // Hide the dropdown after selection
    this.http.get(`${this.baseUrl}/emailfullname`, { params: { fullName: name }, responseType: 'text' }).subscribe(email => {
      this.userEmail = email;
      console.log('Fetched email:', email); // Log fetched email
    });
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onFocus() {
    if (this.fullNameControl.value) {
      this.showDropdown = true;
    }
  }
}
