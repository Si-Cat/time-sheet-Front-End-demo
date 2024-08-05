import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }

  return null;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  timePeriod: string = '';
  work: string = '';
  client: string = '';
  project: string = '';
  hours: string = '';
  description: string = '';
  inSite: boolean = false;

  userEmail: string | null = getCookie('userEmail');
  selectedDate: string = new Date().toISOString().split('T')[0]; // Default to today's date
  selectedDay: string = this.formatDate(new Date());
  weekNumber: number = this.getWeekNumber(new Date());
  minDate: string = '';
  maxDate: string = '';

  allClients: any[] = [];
  filteredClients: any[] = [];
  showClientDropdown: boolean = false;

  allProjects: any[] = [];
  filteredProjects: any[] = [];
  showProjectDropdown: boolean = false;

  private baseUrl = 'http://localhost:8080'; // Update with your actual backend URL

  worksRequiringProject: string[] = ['Project JS',]; // List of works requiring project input

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setMinMaxDates();
    this.updateSelectedDay();
    this.fetchClients();
  }

  setMinMaxDates() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    this.minDate = firstDayOfMonth.toISOString().split('T')[0];
    this.maxDate = lastDayOfMonth.toISOString().split('T')[0];
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  updateSelectedDay() {
    const selectedDate = new Date(this.selectedDate);
    this.selectedDay = this.formatDate(selectedDate);
    this.weekNumber = this.getWeekNumber(selectedDate);
  }

  getWeekNumber(d: Date): number {
    const oneJan = new Date(d.getFullYear(), 0, 1);
    const days = Math.floor((d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + oneJan.getDay() + 1) / 7);
  }

  fetchClients() {
    this.http.get<any[]>(`${this.baseUrl}/client/all`).subscribe(clients => {
      this.allClients = clients;
      this.filteredClients = clients;
    });
  }

  fetchProjectsByClientId(clientId: number) {
    this.http.get<any[]>(`${this.baseUrl}/project/byClientId`, { params: { clientId: clientId.toString() } }).subscribe(projects => {
      this.allProjects = projects;
      this.filteredProjects = projects;
    });
  }

  onClientInput() {
    this.filteredClients = this._filterItems(this.client, this.allClients.map(client => `${client.clientId}: ${client.clientName}`));
    this.showClientDropdown = this.filteredClients.length > 0 && this.client.length > 0;
  }

  onClientBlur() {
    setTimeout(() => {
      this.showClientDropdown = false;
    }, 200);
  }

  onClientFocus() {
    if (this.client.length > 0) {
      this.showClientDropdown = true;
    }
  }

  onClientSelected(client: string) {
    this.client = client;
    const clientId = parseInt(client.split(':')[0].trim(), 10); // Convert clientId to number
    this.fetchProjectsByClientId(clientId);
    this.showClientDropdown = false;
  }

  onProjectInput() {
    this.filteredProjects = this._filterItems(this.project, this.allProjects.map(project => `${project.projectId}: ${project.projectName}`));
    this.showProjectDropdown = this.filteredProjects.length > 0 && this.project.length > 0;
  }

  onProjectBlur() {
    setTimeout(() => {
      this.showProjectDropdown = false;
    }, 200);
  }

  onProjectFocus() {
    if (this.project.length > 0) {
      this.showProjectDropdown = true;
    }
  }

  onProjectSelected(project: string) {
    this.project = project;
    this.showProjectDropdown = false;
  }

  private _filterItems(value: string, items: string[]): string[] {
    const filterValue = value.toLowerCase();
    return items.filter(item => item.toLowerCase().includes(filterValue));
  }

  checkWorkRequiresProject(): boolean {
    return this.worksRequiringProject.includes(this.work);
  }

  submitSchedule() {
    if (this.userEmail) {
      const clientId = parseInt(this.client.split(':')[0].trim(), 10); // Convert clientId to number
      const projectId = this.checkWorkRequiresProject() ? parseInt(this.project.split(':')[0].trim(), 10) : null; // Convert projectId to number or null

      const workDayUpdateDTO = {
        date: this.selectedDate,
        email: this.userEmail,
        hourBlock: this.timePeriod,
        work: this.work,
        client: clientId,
        project: projectId,
        description: this.description,
        hours: this.hours,
        inSite: this.inSite
      };

      this.http.post(`${this.baseUrl}/workday/update`, workDayUpdateDTO).subscribe(response => {
        console.log('Schedule updated successfully', response);
      }, error => {
        console.error('Error updating schedule', error);
      });
    } else {
      console.error('User email not found in cookies');
    }
  }
}
