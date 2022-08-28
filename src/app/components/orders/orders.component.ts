import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  constructor(private ds: DataService, private router: Router, public user: UserService) { }

  loginState = this.user.isLoggedIn();

  ngAfterViewInit(): void {
    this.myOrders();
  }

  dt: any[] = [];
  pending: any;
  completed: any;

  myOrders() {
    let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));

    this.ds.sendApiRequest("orders/" + pload.id, null).subscribe((data: { payload: any[]; }) => {
      this.dt = data.payload;
      console.log(this.dt)
      
      this.pending = this.dt.filter(t=>t.order_status == 1 || t.order_status == 2);
      console.log('Pending:', this.pending);

      this.completed = this.dt.filter(t=>t.order_status == 3 || t.order_status == 0);
      console.log('Completed:', this.completed);
    });

  }

  viewFullDetails(order_info: any){
    console.log(JSON.stringify(order_info));
    window.sessionStorage.setItem(btoa('order_info'), btoa(JSON.stringify(order_info)));
    this.router.navigate(['/order-info']);
  }

}
