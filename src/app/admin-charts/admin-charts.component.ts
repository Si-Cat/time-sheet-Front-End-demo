import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-admin-charts',
  templateUrl: './admin-charts.component.html',
  styleUrls: ['./admin-charts.component.css']
})
export class AdminChartsComponent {
  timea: string = '';
  timeb: string = '';
  charttype: string = '';
  employera: string = '';
  employerb: string = '';


  columnChart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: 'Comparison of Noon and Afternoon Work'
    },
    xAxis: {
      categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Work Amount'
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal'
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        type: 'column',
        name: 'Noon Work',
        data: [5, 3, 4, 7, 2]
      },
      {
        type: 'column',
        name: 'Afternoon Work',
        data: [2, 2, 3, 2, 1]
      }
    ],
    credits: {
      enabled: false
    }
  });

  
}