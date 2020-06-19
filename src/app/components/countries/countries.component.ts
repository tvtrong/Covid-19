import { GoogleChartInterface } from 'ng2-google-charts';
import { DataWiseData } from './../../models/date-wise-data';
import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit } from '@angular/core';
import { merge } from 'rxjs';
import { map } from 'rxjs/Operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  data: GlobalDataSummary[];
  countries: string[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  selectedCountryData: DataWiseData[];
  dateWiseData;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart'
  };
  constructor(private service: DataServiceService) { }

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(
        map(result => {
          this.data = result;
          this.data.forEach(cs => {
          this.countries.push(cs.country);
      });
        })
      )
    ).subscribe({
      complete: () => {
        this.updateValues('Vietnam');
        this.loading = false;
        // this.selectedCountryData = this.dateWiseData['Vietnam'];
        // this.updateChart();
      }
    });
  }

  updateChart(){
    let dataTable = [];
    dataTable.push(['Date', 'Cases']);
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases]);
    });
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: dataTable,
      //firstRowIsData: true,
      options: {
        height: 500,
        is3D: true,
        animation: {
          duration: 1000,
          easing: 'out',
        }
      },
    };
  }
  updateValues(country: string){
    this.data.forEach(cs => {
      if (cs.country === country){
        this.totalActive += cs.active;
        this.totalConfirmed += cs.confirmed;
        this.totalDeaths += cs.deaths;
        this.totalRecovered += cs.recovered;
      }
    });
    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
  }

}
