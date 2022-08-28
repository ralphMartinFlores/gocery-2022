import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrderInfoComponent } from './components/order-info/order-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './register/register.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OtpComponent } from './register/otp/otp.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component';
import { EditNameComponent } from './components/profile/edit-profile/edit-name/edit-name.component';
import { EditAddressComponent } from './components/profile/edit-profile/edit-address/edit-address.component';
import { EditContactComponent } from './components/profile/edit-profile/edit-contact/edit-contact.component';
import { EditPasswordComponent } from './components/profile/edit-profile/edit-password/edit-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    ProductsComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent,
    OrderInfoComponent,
    HomeComponent,
    RegisterComponent,
    OtpComponent,
    ProfileComponent,
    EditProfileComponent,
    EditNameComponent,
    EditAddressComponent,
    EditContactComponent,
    EditPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
