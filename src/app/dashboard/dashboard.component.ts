import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Chart, Point } from "chart.js";
import { ChartData } from '../models/chart';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild('chart', { static: false })
  private chartRef: ElementRef;
  private chart: Chart;

  userId:any;

  chartData: ChartData[];

  labels = ['dx_esrd', 'dx_mi', 'dx_stroke', 'dx_htn', 'dx_lpd', 'dx_obe', 'dx_dneu', 'dx_cad', 'dx_pvd', 'dx_anm'];

  colors = ['#0091ad', '#5c4d7d', '#f28482']

  constructor(
    private sharedService: SharedService,
    private snackBar: MatSnackBar,
    private router:Router
  ) {
    this.getChartData();
    if(!localStorage.getItem('userId')){
      this.snackBar.open('You are currently not logged in!!', 'Close', {verticalPosition:'top', duration:2000});
      this.router.navigateByUrl("");
    } 
    else{
      this.userId = localStorage.getItem('userId');
    }
  }

  ngOnInit() {
    this.sharedService.getLocalStorageID().subscribe(res=>{
      if(!res){
        this.router.navigateByUrl("");
        this.snackBar.open('You are currently not logged in!!', 'Close', {verticalPosition:'top', duration:2000});
      }
      else{
        this.userId = localStorage.getItem('userId');
      }
    })
  }

  getChartData() {
    this.sharedService.getChartData()
      .then(response => {
        if (response.success) {
          this.chartData = response.data;
        }
        else {
          this.snackBar.open('Unable to retrieve snackbar', 'Close',  {verticalPosition:'top', duration:2000});
        }
      })
      .catch(err=>{
        this.snackBar.open('Unable to retrieve snackbar', 'Close',  {verticalPosition:'top', duration:2000});
      })
  }

  perfomAction(){
    this.sharedService.recordAction(this.userId)
    .then(response => {
      if (!response.success) {
        this.snackBar.open('Unable to record the action time', 'Close', {verticalPosition:'top', duration:2000});
      }
    })
    .catch(err=>{
      this.snackBar.open('Unable to record the action time', 'Close', {verticalPosition:'top', duration:2000});
    })

  }


  displayChart() {

    this.perfomAction();

    let data = {
      labels: this.labels,
      datasets: []
    };

    this.chartData.map((res, i) => {
      data.datasets.push({
        label: res.POP,
        data: Object.values(res).slice(1),
        backgroundColor: this.colors[i]
      })
    })

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data
    })
  }

  logout(){
    this.sharedService.logout();
  }
}
