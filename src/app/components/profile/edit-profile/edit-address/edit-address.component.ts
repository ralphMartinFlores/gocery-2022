import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;


@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements OnInit {

  constructor(public user: UserService, private ds: DataService, private router: Router) { }

  loginState = this.user.isLoggedIn();

  updateAddressForm = new FormGroup({
    acc_no: new FormControl('', [Validators.required]),
    acc_street: new FormControl('', [Validators.required]),
    acc_barangay: new FormControl('', [Validators.required])
  });

  isSubmitted = false;

  ngOnInit(): void {
  }

  get f(){
    return this.updateAddressForm.controls;
  }

  acc_no: any;
  acc_street: any;
  acc_barangay: any = 'Barangay';
  acc_city: any = 'Olongapo City';
  acc_province: any = 'Zambales';

  submitForm() {
    this.isSubmitted = true;
    if (!this.updateAddressForm.valid) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please provide all the required details.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'crimson'
      })
      return false;
    } else {
      console.log(this.updateAddressForm.value)
      let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
      this.ds.sendApiRequest("updateProfile/" + pload.id, this.updateAddressForm.value).subscribe((data: { payload: any[]; }) => {
        Swal.fire({
          title: 'Success!',
          text: 'Address updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'forestgreen'
        }).then((result) => {
          if (result.isConfirmed) {
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editAddressModal'));
            myModal.hide();
            this.router.navigate(['profile']);
          }
        })
      }, (err: any) => {
        Swal.fire({
          title: 'Oops!',
          text: 'Your address was not updated.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'crimson'
        })
      });
    }
  }

}
