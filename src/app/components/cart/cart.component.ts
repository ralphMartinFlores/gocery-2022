import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  constructor(private ds: DataService, private router: Router, public user: UserService) { }

  loginState = this.user.isLoggedIn();

  ngOnInit(): void {
    this.getCart();
  }

  // CART Functions
  private subs!: Subscription;
  message: any;

  cart_qty: any = "";
  dt: any[] = [];
  cart_info: any = {};
  seller_handler: any;
  seller: any[] = [];
  sendMessage(): void {
    this.ds.sendUpdate('Message from Sender Component to Receiver Component!');
  }

  getCart() {
    let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));

    this.seller = [];
    this.seller_handler = null;
    this.ds.sendApiRequest("cart/" + pload.id, null).subscribe((data: { payload: any[]; }) => {
      this.dt = data.payload;
      console.log(this.dt)
      
      for(var i = 0; i < this.dt.length; i++) {
        if(this.seller_handler != this.dt[i].store_id) {
          this.seller.push(this.dt[i]);
        }
        this.seller_handler = this.dt[i].store_id;
      }

      console.log(this.seller)
      // if(this.dt != ''){
      // this.cart_qty = this.dt[0].cart_quantity;
      // }
    }, (er: any) => {
      });
  }

  addQuantity(id: string, qty: number) {
    this.cart_info.cart_quantity = qty + 1;
    this.ds.sendApiRequest("addQuantity/" + id, this.cart_info).subscribe((data: { payload: any[]; }) => {
      this.sendMessage();
      this.getCart();
    });
  }

  subtractQuantity(id: string, qty: number) {
    if(qty > 1) {
      this.cart_info.cart_quantity = qty - 1;
      this.ds.sendApiRequest("subtractQuantity/" + id, this.cart_info).subscribe((data: { payload: any[]; }) => {
        this.sendMessage();
        this.getCart();
      });
    }
  }

  toDeleteCart: any = {};
  deleteProduct(id: string) {
    this.toDeleteCart.cart_status = 0;
    this.ds.sendApiRequest("archiveCart/" + id, this.toDeleteCart).subscribe((data: { payload: any[]; }) => {
      this.sendMessage();
      this.getCart();
      Swal.fire({
        title: 'Success!',
        text: 'Product removed from your cart.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: 'forestgreen'
      })
    });
  }

  checkOut() {
    if(this.dt.length != 0){
      console.log(this.dt)
      this.router.navigate(['/checkout']);
    }
    else {
      Swal.fire({
        title: 'Oops!',
        text: 'Your cart is still empty.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#f89406'
      })
    }
  }
  // End of Cart Functions
}
