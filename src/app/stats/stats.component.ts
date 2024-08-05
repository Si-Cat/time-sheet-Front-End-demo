import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from '../cookie.service';
import { isPlatformBrowser } from '@angular/common';
import { SourceTextModule } from 'vm';
import { log } from 'console';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent  {
  parentData: string = "Stats";
  userIsAdmin: boolean = true;
  userEmail: string | null = null;
  startOfWeekDate: string;

  constructor() {
    this.startOfWeekDate = this.calculateFirstDayOfWeek();
    console.log(this.startOfWeekDate);
    
  }

  calculateFirstDayOfWeek(): string {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 1 for Monday, etc.
    const diff = (dayOfWeek + 6) % 7; // Calculate how many days to subtract to get to Monday
    const firstDay = new Date(today.setDate(today.getDate() - diff));
    return firstDay.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }
}
