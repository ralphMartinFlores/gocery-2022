import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.scss']
})
export class OrderInfoComponent implements OnInit {

  constructor(private ds: DataService, private router: Router, public user: UserService) { }

  loginState = this.user.isLoggedIn();
  order_info: any = JSON.parse(atob(decodeURIComponent((window.sessionStorage.getItem(btoa('order_info')) || '{}'))))

  ngOnInit(): void {
    this.getOrder();
    this.getOrderItems();
    this.getOrderDetails();
  }

  dt: any[] = [];
  
  getOrder(){
    this.dt.push(this.order_info);
    console.log(this.dt[0]);
  }

  order_item: any[] = [];
  getOrderItems() {
    this.ds.sendApiRequest("order_items/" + this.dt[0].order_id, null).subscribe((data: { payload: any[]; }) => {
      this.order_item = data.payload;
      console.log('Order Item:', this.order_item)
    });
  }

  order_details: any[] = [];
  getOrderDetails() {
    this.ds.sendApiRequest("order_details/" + this.dt[0].order_id, null).subscribe((data: { payload: any[]; }) => {
      this.order_details = data.payload;
      console.log(this.order_details[0].acc_no)
    });
  }

  orderStatus: any = {};
  cancelOrder() {
    this.orderStatus.order_status = 0;
    this.ds.sendApiRequest("cancelOrder/" + this.dt[0].order_id, this.orderStatus).subscribe((data: { payload: any[]; }) => {
    console.log("Order cancelled");
    this.order_item = data.payload;
    this.router.navigate(['/orders']);
    });
  }

}
