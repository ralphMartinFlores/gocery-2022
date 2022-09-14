import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Populate category grid tile
  categories = [
    {
      name:'Meat', 
      description:'Major ingredients are water, protein, and fat. Although it can be eaten raw, it is more commonly consumed after being cooked, seasoned, or processed in a number of ways.',
      icon_name:'meat',
      alt:'Meat category icon'
    },
    {
      name:'Vegetables', 
      description:'Typically low in fat and carbohydrates but high in vitamins, minerals, and dietary fiber, can be consumed either raw or cooked and are crucial to human nutrition.',
      icon_name:'vegetable',
      alt:'Vegetable category icon'
    },
    {
      name:'Seafood', 
      description:'Prominently includes fish and shellfish, it is an important source of protein in many diets around the world, especially in coastal areas',
      icon_name:'seafood',
      alt:'Seafood category icon'
    },
    {
      name:'Beverages', 
      description:'Satisfy your thirsts with water, milk, coffee, juice, smoothies, soft drinks.',
      icon_name:'beverages',
      alt:'Beverages category icon'
    },
    {
      name:'Canned Goods', 
      description:'Enjoy your canned food from your favorite brands here, spanish sardines, corned beef, mackerel in natural oil.',
      icon_name:'canned-food',
      alt:'Canned Food category icon'
    },
    {
      name:'Dairy', 
      description:'Enjoy milk based products and any of the foods made from milk, including butter, cheese, ice cream, yogurt, and condensed and dried milk.',
      icon_name:'dairy',
      alt:'Dairy category icon'
    },
    {
      name:'Personal Care', 
      description:'Products that generally belong to hygienic practices and rinse off immediately after use, such as shampoos, soaps, toothpastes, and shower gels.',
      icon_name:'personal-hygiene',
      alt:'Personal care category icon'
    },
    {
      name:'Cleaners', 
      description:'Get your blend of specialty materials used to remove soils and stains from a surface and to restore the surface to its original condition',
      icon_name:'cleaning-products',
      alt:'Cleaning category icon'
    },
    {
      name:'Fruits', 
      description:'Order healthy fruits that provide you with lots of nutrients and hydrating feeling.',
      icon_name:'fruits',
      alt:'Fruits category icon'
    },
    {
      name:'Bread',
      description:'Get your all time favorite baked products here.', 
      icon_name:'bread',
      alt:'Bread category icon'
    },
  ];

  constructor(public _router: Router, private ds: DataService, public user: UserService) { }

  loginState = this.user.isLoggedIn();

  ngOnInit(): void {
    console.log(this.loginState)
    this.getUserProfile();
    this.getStores();
    this.featuredProduct();
    this.getCart();
  }

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

  dt: any[] = [];
  getUserProfile() {
    let pload  = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
    this.ds.sendApiRequest("accounts/" + pload.id, null).subscribe((data: { payload: any[]; }) => {
      this.dt = data.payload;
      console.log(this.dt)
    });
  }

  productdata: any[] = [];
  randomitem: any;
  featuredProduct() {
    this.ds.sendApiRequest("products/", null).subscribe((data: { payload: any[]; }) => {
      this.productdata = data.payload;
      this.randomitem = this.productdata[Math.floor(Math.random() * this.productdata.length)];
      console.log(this.randomitem)
    });
  }

  stores: any[] = [];
  getStores() {
    this.ds.sendApiRequest("stores/", null).subscribe((data: { payload: any[]; }) => {
      this.stores = data.payload;
      console.log(this.stores)
    });
  }

  gotoStore(store: string) {
    console.log(store)
    window.sessionStorage.setItem(btoa('store_id'), btoa(store))
    window.sessionStorage.setItem('Store Name', store)
    this._router.navigate(['/store']);
  }

  getStoreName(store: string) {
    console.log(store)
    window.sessionStorage.setItem('Store Name', store)
    window.sessionStorage.setItem('Product Header', store)
  }

  // Get name of clicked category tile
  categoryClick(name: string) {
    window.sessionStorage.setItem(btoa('cat_id'), btoa(name))
    window.sessionStorage.setItem('Category', name)
    window.sessionStorage.setItem('Product Header', name)
    window.sessionStorage.setItem('Tile', 'Category')
    this._router.navigate(['/products']);
    console.log(name);
  }

  storeClick(store: string) {
    console.log(store)
    window.sessionStorage.setItem(btoa('store_id'), btoa(store))
    window.sessionStorage.setItem('Store Name', store)
    window.sessionStorage.setItem('Tile', 'Store')
    this._router.navigate(['/products']);
  }

  cart_content: any = {};
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
          text: "This product is now added to your Go-Cart!",
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'forestgreen'
        })
        this.getCart();
      });
      console.log(this.cart_content.length)
    } else{
      if (this.cart_content.some((t: { product_id: any; })=>t.product_id == id) == true) {
        this.getCart();
        console.log("Product already in cart")
      } else {
        this.ds.sendApiRequest("addToCart/", this.cartContent).subscribe((data: { payload: any[]; }) => {
          Swal.fire({
            title: 'Success!',
            text: "This product is now added to your Go-Cart!",
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: 'forestgreen'
          })
          this.getCart();
        });
      }
    }
  }
}


