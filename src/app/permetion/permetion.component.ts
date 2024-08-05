import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-permetion',
  templateUrl: './permetion.component.html',
  styleUrls: ['./permetion.component.css']
})
export class PermetionComponent implements OnInit {
  noonClient: string = "";
  employeeControl = new FormControl();
  allNames: string[] = [];
  filteredNames: string[] = [];
  showDropdown: boolean = false;

  private baseUrl = 'http://localhost:8080/employee'; // Update with your actual backend URL

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchFullNames();
    this.employeeControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterNames(value))
    ).subscribe(filteredNames => {
      this.filteredNames = filteredNames;
      this.showDropdown = filteredNames.length > 0 && this.employeeControl.value; // Only show dropdown when there are filtered names and the input is not empty
      console.log('Filtered names:', this.filteredNames); // Log filtered names
    });
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

  onNameSelected(name: string) {
    this.employeeControl.setValue(name, { emitEvent: false });
    this.showDropdown = false; // Hide the dropdown after selection
  }

  onBlur() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onFocus() {
    if (this.employeeControl.value) {
      this.showDropdown = true;
    }
  }
}
