import { Component, OnInit, Input, Inject, PLATFORM_ID, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from '../cookie.service'; // Adjust the path as necessary
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-work-load-table',
  templateUrl: './work-load-table.component.html',
  styleUrls: ['./work-load-table.component.css']
})
export class WorkLoadTableComponent implements OnInit, OnChanges {
  @Input() userEmail: string | null = null;
  @Input() firstDayOfWeek: string | null = null;

  groupedTableData: { day: string, entries: { day: string, time: string, work: string, client: string, project: string, hours: number, description: string, insite: boolean }[] }[] = [];
  totalHours: number = 0;
  remainingHours: number = 0;

  constructor(private http: HttpClient, private cookieService: CookieService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // If userEmail is not provided via Input, get it from cookies
      if (!this.userEmail) {
        this.userEmail = this.cookieService.getCookie('userEmail');
      }

      console.log('User Email:', this.userEmail);
      console.log('First Day of the Week:', this.firstDayOfWeek);

      if (this.userEmail && this.firstDayOfWeek) {
        this.fetchWeeklyData();
      } else {
        console.error('User email or first day of the week is not found and was not provided');
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['firstDayOfWeek']) {
      console.log('First day of the week changed:', this.firstDayOfWeek);
    }
    if (changes['firstDayOfWeek'] && !changes['firstDayOfWeek'].isFirstChange()) {
      console.log('First day of the week changed:', this.firstDayOfWeek);
      this.fetchWeeklyData();
    }
    if (changes['userEmail']) {
      console.log('User email changed:', this.userEmail);
    }
    if (changes['userEmail'] && !changes['userEmail'].isFirstChange()) {
      console.log('User email changed:', this.userEmail);
      this.fetchWeeklyData();
    }
  }

  fetchWeeklyData() {
    if (this.firstDayOfWeek) {
      const formattedDate = new Date(this.firstDayOfWeek).toISOString().split('T')[0];
      console.log('Fetching data for start date:', formattedDate);
      const url = `http://localhost:8080/workday/getMap?email=${this.userEmail}&startDayOfWeek=${formattedDate}`;
      console.log(url);
      this.http.get<any[]>(url).subscribe(data => {
        this.updateTableData(data);
      }, error => {
        console.error('Error fetching weekly data', error);
      });
    } else {
      console.error('First day of the week is not provided');
      // Optionally, set a default date or handle the error
    }
  }

  updateTableData(data: any[]) {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const hourBlocks = ['H1', 'H2', 'H3', 'H4'];
    const groupedData: { [key: string]: any[] } = {};
    this.totalHours = 0; // Initialize total hours to zero
  
    // Initialize groupedData with empty arrays for each day of the week
    daysOfWeek.forEach(day => {
      groupedData[day] = [];
    });
  
    data.forEach(item => {
      const day = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
  
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
  
      hourBlocks.forEach(time => {
        const work = item[`${time.toLowerCase()}Work`] || '';
        const entry = {
          day: day,
          time: time,
          work: work,
          client: work ? item[`${time.toLowerCase()}Client`] || '' : '',
          project: work ? item[`${time.toLowerCase()}Project`] || '' : '',
          hours: work ? item[`${time.toLowerCase()}Hours`] || 0 : 0,
          insite: work ? item[`${time.toLowerCase()}InSite`] || false : false,
          description: work ? item[`${time.toLowerCase()}Description`] || '' : ''
        };
  
        this.totalHours += entry.hours > 0 ? entry.hours : 0; // Add the hours to the total if they are greater than 0
  
        groupedData[day].push(entry);
      });
    });
  
    // Ensure each day has all hour blocks even if they are empty
    this.groupedTableData = daysOfWeek.map(day => ({
      day,
      entries: groupedData[day].length ? groupedData[day] : hourBlocks.map(time => ({
        day,
        time: time,
        work: '',
        client: '',
        project: '',
        hours: 0,
        insite: false,
        description: ''
      }))
    }));
  
    this.remainingHours = 40 - this.totalHours;
  
    console.log(this.groupedTableData);
    console.log("Total hours worked: " + this.totalHours);
  }
  

  // updateTableData(data: any[]) {
  //   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  //   const hourBlocks = ['H1', 'H2', 'H3', 'H4'];
  //   const groupedData: { [key: string]: any[] } = {};
  //   this.totalHours = 0; // Initialize total hours to zero
  
  //   // Initialize groupedData with empty arrays for each day of the week
  //   daysOfWeek.forEach(day => {
  //     groupedData[day] = [];
  //   });
  
  //   data.forEach(item => {
  //     const day = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
  
  //     if (!groupedData[day]) {
  //       groupedData[day] = [];
  //     }
  
  //     hourBlocks.forEach(time => {
  //       const entry = {
  //         day: day,
  //         time: time,
  //         work: item[`${time.toLowerCase()}Work`] || '',
  //         client: item[`${time.toLowerCase()}Client`] || '',
  //         project: item[`${time.toLowerCase()}Project`] || '',
  //         hours: item[`${time.toLowerCase()}Hours`] || 0,
  //         insite: item[`${time.toLowerCase()}InSite`] || false,
  //         description: item[`${time.toLowerCase()}Description`] || ''
  //       };
  
  //       this.totalHours += entry.hours > 0 ? entry.hours : 0; // Add the hours to the total if they are greater than 0
  
  //       groupedData[day].push(entry);
  //     });
  //   });
  
  //   // Ensure each day has all hour blocks even if they are empty
  //   this.groupedTableData = daysOfWeek.map(day => ({
  //     day,
  //     entries: groupedData[day].length ? groupedData[day] : hourBlocks.map(time => ({
  //       day,
  //       time: time,
  //       work: '',
  //       client: '',
  //       project: '',
  //       hours: 0,
  //       insite: false,
  //       description: ''
  //     }))
  //   }));
  
  //   this.remainingHours = 40 - this.totalHours;
  
  //   console.log(this.groupedTableData);
  //   console.log("Total hours worked: " + this.totalHours);
  // }
  
}
