import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {


  headerName: string | null = sessionStorage.getItem("Product Header")
  prod_id = window.sessionStorage.getItem(btoa('product_id'));

  search = new FormControl();
  term: any;
  
  constructor(private ds: DataService, public user: UserService, private router: Router) { }

  isShow: boolean;
  topPosToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  loginState = this.user.isLoggedIn();

  ngOnInit(): void {
    const tileName = window.sessionStorage.getItem("Tile");
    if (tileName === "Category") {
      this.categoryProducts();
    } else {
      this.storeProducts();
    }
    // this.getCart();
  }

  dt: any[] = [];
  randomitem: any = [];
  categoryProducts() {
    let cat_id = atob(window.sessionStorage.getItem(btoa('cat_id')) || '{}')
    this.ds.sendApiRequest("products/" + cat_id, null).subscribe((data: { payload: any[]; }) => {
      this.dt = data.payload;
      this.randomitem = this.dt[Math.floor(Math.random() * this.dt.length)];
      console.log(this.dt)
      console.log(this.randomitem)
    });
  }

  storeProducts() {
    let store_id = atob(window.sessionStorage.getItem(btoa('store_id')) || '{}')
    this.ds.sendApiRequest("storeProducts/" + store_id, null).subscribe((data: { payload: any[]; }) => {
      this.dt = data.payload;
      this.randomitem = this.dt[Math.floor(Math.random() * this.dt.length)];
      console.log(this.dt)
    });
  }

  viewProduct(product_id: any) {
    // product_id = product_id;
    window.sessionStorage.setItem(btoa('product_id'), btoa(product_id));
  }

  cart_content: any = [];
  cartContent: any = {};
  
  getCart() {
    let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
    this.ds.sendApiRequest("cart/" + pload.id, null).subscribe((data: { payload: any[]; }) => {
      this.cart_content = data.payload;
    }, (er: any) => {
    
    });
  }


  addToCart(id: any) {

    let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
    this.cartContent.acc_id = pload.id;
    this.cartContent.product_id = id;
    
    console.log(this.cart_content.length)
    this.getCart();
    if(this.cart_content.length == 0){
      this.ds.sendApiRequest("addToCart/", this.cartContent).subscribe((data: { payload: any[]; }) => {
        Swal.fire({
          title: 'Success!',
          text: 'Product added to your cart.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#228B22'
        })
        this.getCart();
      });
      console.log(this.cart_content.length)
    }else{
      if (this.cart_content.some((t: { product_id: any; })=>t.product_id == id) == true) {
        Swal.fire({
          title: 'Oops!',
          text: 'Product is already in your cart.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'crimson'
        })
        this.getCart();
      } else {
        this.ds.sendApiRequest("addToCart/", this.cartContent).subscribe((data: { payload: any[]; }) => {
          Swal.fire({
            title: 'Success!',
            text: 'Product added to your cart.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#228B22'
          })
          this.getCart();
        });
      }
    }
  }
}
