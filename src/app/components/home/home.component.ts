import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import {GoogleChartInterface} from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[];
  pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
    dataTable: null
  };
  columnChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: null
  };
  constructor(private dataService: DataServiceService) { }
  initChart(caseType: string){
    const data = [];
    data.push(['Country', 'Cases']);
    this.globalData.forEach(cs => {
      let value: number;
      if (caseType === 'c'){
        if (cs.confirmed > 0){
          value = cs.confirmed;
      }}
      else if (caseType === 'r'){
        if (cs.recovered > 0){
          value = cs.recovered;
      }}
      else if (caseType === 'd'){
        if (cs.deaths >= 0){
          value = cs.deaths;
      }}
      else if (caseType === 'a'){
        if (cs.active > 0){
          value = cs.active;
      }}
      data.push([
        cs.country,
        value
      ]);
    });
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: data,
      options: {
        height: 500,
        is3D: true,
        animation: {
          duration: 1000,
          easing: 'out',
        }
      }
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: data,
      options: {
        height: 500,
        animation: {
          duration: 1000,
          easing: 'out',
        }
      }
    };
  }
  ngOnInit(): void {
    this.dataService.getGlobalData()
    .subscribe(
      {
        next: (result) => {
          this.globalData = result;
          result.forEach(cs => {
            if (!Number.isNaN(cs.confirmed)){
              this.totalConfirmed += cs.confirmed;
              this.totalActive += cs.active;
              this.totalRecovered += cs.recovered;
              this.totalDeaths += cs.deaths;
            }
          });
          this.initChart('c');
        },
        complete: () => {
          this.loading = false;
        }
      }
    );
  }
  updateChart(input: HTMLInputElement){
    this.initChart(input.value);
  }
}
