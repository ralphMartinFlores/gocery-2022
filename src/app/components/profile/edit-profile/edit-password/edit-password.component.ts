import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss']
})
export class EditPasswordComponent implements OnInit {

  constructor(private ds: DataService, private router: Router, private user: UserService) { }

  loginState = this.user.isLoggedIn();

  updatePasswordForm = new FormGroup({
    acc_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    acc_confirmpassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  isSubmitted = false;

  ngOnInit(): void {
  }

  get f(){
    return this.updatePasswordForm.controls;
  }

  acc_password: any;
  acc_confirmpassword: any;
  acc_credentails: any = {};


  submitForm() {
    this.isSubmitted = true;
    if (!this.updatePasswordForm.valid) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please provide all the required details.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'crimson'
      })
      return false;
    }
    if (this.acc_password != this.acc_confirmpassword) {
      Swal.fire({
        title: 'Oops!',
        text: 'Make sure your passwords match.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'crimson'
      })
    }
    else {
      console.log(this.updatePasswordForm.value)
      console.log(this.updatePasswordForm.value)
      let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
      this.ds.sendApiRequest("updatePassword/" + pload.id, this.updatePasswordForm.value).subscribe((data: { payload: any[]; }) => {
        Swal.fire({
          title: 'Success!',
          text: 'Password updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'forestgreen'
        }).then((result) => {
          if (result.isConfirmed) {
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editPasswordModal'));
            myModal.hide();
            this.router.navigate(['profile']);
          }
        })
      }, (err: any) => {
        Swal.fire({
          title: 'Oops!',
          text: 'Your password cannot be changed.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'crimson'
        })
      });
    }
  }

}
