import { Component, Input, OnChanges, SimpleChanges, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '../cookie.service'; // Adjust the path as necessary
import * as Highcharts from 'highcharts';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnChanges {
  @Input() userEmail: string | null = null;
  time: string = "This week"; // Internal time state

  // Define the project matrix with values and colors
  projectMatrix: { [projectType: string]: { value: number; color: string } } = {
    'Project JS': { value: 0, color: '#f7a35c' },
    'Avant VRND': { value: 0, color: '#7cb5ec' },
    'innovation': { value: 0, color: '#90ed7d' },
    'formation': { value: 0, color: '#434348' },
    'auto formation': { value: 0, color: '#f15c80' },
    'conge': { value: 0, color: '#e4d354' },
    'recrutment': { value: 0, color: '#8085e9' },
    'vacance': { value: 0, color: '#f15c80' },
    'project': { value: 0, color: '#2b908f' },
    'project-int': { value: 0, color: '#f7a35c' },
    'investissement': { value: 0, color: '#7cb5ec' },
    'reunions cis': { value: 0, color: '#90ed7d' },
    'management transferet competence': { value: 0, color: '#434348' },
    'no travaille': { value: 0, color: '#f15c80' },
    'autre': { value: 0, color: '#e4d354' }
  };

  pieChart: Chart;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cookieService: CookieService,
    private http: HttpClient // Added HttpClient here
  ) {
    this.pieChart = new Chart({
      chart: {
        type: 'pie',
        plotShadow: false,
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          innerSize: '0%', // Change to make it a pie chart
          borderWidth: 1,
          borderColor: '',
          slicedOffset: 60,
          dataLabels: {
            connectorWidth: 0,
          },
        },
      },
      title: {
        verticalAlign: 'bottom',
        floating: true,
        text: 'work',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          data: this.convertMatrixToChartData(),
        },
      ],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges triggered', changes);
    if (!this.userEmail) {
      this.userEmail = this.cookieService.getCookie('userEmail'); // Adjust based on your cookie handling library
    }

    if (changes['userEmail']) {
      const userEmailChange = changes['userEmail'];
      console.log('User email changed:', userEmailChange.currentValue);

      if (userEmailChange.currentValue) {
        this.userEmail = userEmailChange.currentValue;
      }
    }

    if (this.userEmail && this.time) {
      this.fetchAndProcessData();
    } else {
      console.error('User email or time is missing');
    }
  }

  setTime(event: EventTarget | null) {
    if (event && event instanceof HTMLSelectElement) {
      this.time = event.value;
      console.log('Time updated to:', this.time);
      if (this.userEmail) {
        this.fetchAndProcessData();
      }
    } else {
      console.error('Invalid event target');
    }
  }

  fetchAndProcessData() {
    if (this.userEmail && this.time) {
      const { startDate, endDate } = this.getDateRange(this.time);
      console.log(`Fetching data from ${startDate} to ${endDate}`);
      this.http.get<any[]>(`http://localhost:8080/workday/getRange?email=${this.userEmail}&startDate=${startDate}&endDate=${endDate}`).subscribe(
        (data: any[]) => {
          console.log('Data received from API:', data);
          this.processData(data, startDate, endDate);
          const chartData = this.convertMatrixToChartData();
          this.updateChart(chartData);
        }, 
        (error: any) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      console.error('User email or time is missing');
    }
  }

  getDateRange(time: string): { startDate: string, endDate: string } {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (time) {
      case 'This week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
        endDate = new Date(today.setDate(startDate.getDate() + 6)); // Sunday
        break;
      case 'Last week':
        startDate = new Date(today.setDate(today.getDate() - today.getDay() - 6)); // Monday of last week
        endDate = new Date(today.setDate(startDate.getDate() + 6)); // Sunday of last week
        break;
      case 'This month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        // Calculate the start of the next week
        let monthNextWeekStart = new Date(today);
        monthNextWeekStart.setDate(today.getDate() + (7 - today.getDay()));

        // If the next week starts in the current month
        if (monthNextWeekStart.getMonth() === today.getMonth()) {
          endDate = new Date(monthNextWeekStart.setDate(monthNextWeekStart.getDate() - 1)); // Day before the start of next week
        }
        break;
      case 'Last month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'This year':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear(), 11, 31); // Last day of the year

        // Calculate the start of the next week
        let yearNextWeekStart = new Date(today);
        yearNextWeekStart.setDate(today.getDate() + (7 - today.getDay()));

        // If the next week starts in the current year
        if (yearNextWeekStart.getFullYear() === today.getFullYear()) {
          endDate = new Date(yearNextWeekStart.setDate(yearNextWeekStart.getDate() - 1)); // Day before the start of next week
        }
        break;
      case 'Last year':
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;
      default:
        startDate = endDate = today;
        break;
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }

  processData(data: any[], startDate: string, endDate: string) {
    console.log('Processing data:', data);

    // Reset values to zero
    Object.keys(this.projectMatrix).forEach(key => {
      this.projectMatrix[key].value = 0;
    });

    const dateRange = this.getDateRangeArray(new Date(startDate), new Date(endDate));
    const totalWorkingDays = dateRange.length;
    const totalWorkingHours = totalWorkingDays * 8;
    let totalLoggedHours = 0;

    // Process fetched data
    data.forEach(item => {
      const hourBlocks = ['h1', 'h2', 'h3', 'h4'];
      hourBlocks.forEach(block => {
        const work = item[`${block}Work`] || 'autre';
        const hours = item[`${block}Hours`] || 0;

        if (this.projectMatrix[work]) {
          this.projectMatrix[work].value += hours;
        } else {
          this.projectMatrix['autre'].value += hours;
        }

        totalLoggedHours += hours;
      });
    });

    // Calculate the no travaille hours
    this.projectMatrix['no travaille'].value = totalWorkingHours - totalLoggedHours;

    console.log('Processed Project Matrix:', this.projectMatrix);
  }

  getDateRangeArray(startDate: Date, endDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      // Exclude weekends (Saturday and Sunday)
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  convertMatrixToChartData() {
    const chartData = Object.keys(this.projectMatrix).map(key => {
      return {
        name: key,
        y: this.projectMatrix[key].value,
        color: this.projectMatrix[key].color
      };
    });
    return chartData;
  }

  updateChart(data: any[]) {
    if (this.pieChart.ref && this.pieChart.ref.series && this.pieChart.ref.series[0]) {
      this.pieChart.ref.series[0].setData(data);
    } else {
      console.error('Chart series is not defined');
    }
  }
}
