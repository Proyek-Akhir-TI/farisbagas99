import { Component,OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as HighCharts from 'highcharts';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-daya',
  templateUrl: './daya.page.html',
  styleUrls: ['./daya.page.scss'],
})
export class DayaPage implements OnInit{

  chart: any;
  jumlah_result: number;
	
constructor( 
	private http: HttpClient,
	public navCtrl: NavController,
  public loadingService: LoadingService){
  
  this.jumlah_result = 0;
  this.kirim();
  this.loadingService.present({
      message:'Mengambil data',
      duration: 3000
      }); 
}

ngOnInit(){
 
}

goToDashboardPage(){
    this.navCtrl.navigateForward('/dashboard');
    }

url:any;
kirim() {
  this.loadingService.present({
    duration: 2000
  });

  const data = 'https://api.thingspeak.com/channels/1163360/fields/3.json?api_key=6KZQ9IWS362V6KF1&results='+this.jumlah_result;
  this.http.get(data).subscribe(res => {
    this.url = res;
  });
  console.log(this.url);
  }  

   async chartOnLoad() {
  if(this.url != undefined) {
  this.chart.series[0].setData(this.url.feeds.map(feed => {
    var x = (new Date(feed.created_at)).getTime();
    var y = parseFloat(feed.field3);
    return {
      x: x,
      y: y,
      name: "Point",
      color: "#FF9100"
    }
  }), true);
  }
}

  ionViewDidEnter() {
  this.chart = HighCharts.chart('container', {
    chart: {
      type: 'spline',
      marginRight: 10,
      events: {
        load: () => {
          setInterval(async () => {
            await this.chartOnLoad();
          }, 1000);
        }
      },
    },

    time: {
      useUTC: false
    },

    title: {
      text: 'Live Monitoring Daya'
    },

    xAxis: {
     type: 'datetime',
       tickPixelInterval: 50
     },

    yAxis: {
      title: {
        text: 'Watt'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },

    tooltip: {
      headerFormat: '<b>{series.name}</b><br/>',
      pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },

    exporting: {
      enabled: false
    },

    series: [{
      name: 'Daya',
      type: undefined,
      data: []
    }]

  });

  }
}
