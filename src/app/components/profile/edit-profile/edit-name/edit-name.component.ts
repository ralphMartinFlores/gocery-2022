import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-name',
  templateUrl: './edit-name.component.html',
  styleUrls: ['./edit-name.component.scss']
})
export class EditNameComponent implements OnInit {

  constructor(public user: UserService, private ds: DataService, private router: Router) { }

  loginState = this.user.isLoggedIn();

  updateNameForm = new FormGroup({
    acc_fname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z \-\']+')]),
    acc_mname: new FormControl('', [Validators.minLength(2), Validators.pattern('^[a-zA-Z \-\']+')]),
    acc_lname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z \-\']+')])
  });

  isSubmitted = false;

  ngOnInit(): void {
  }

  get f(){
    return this.updateNameForm.controls;
  }

  acc_fname: any;
  acc_lname: any;
  acc_mname: any = '';
  acc_fullname: any = {};

  submitForm() {
    this.isSubmitted = true;
    if (!this.updateNameForm.valid) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please provide all the required details.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'crimson'
      })
      return false;
    } else {
      console.log(this.updateNameForm.value)
      let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
      this.ds.sendApiRequest("updateProfile/" + pload.id, this.updateNameForm.value).subscribe((data: { payload: any[]; }) => {
        Swal.fire({
          title: 'Success!',
          text: 'Name updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'forestgreen'
        }).then((result) => {
          if (result.isConfirmed) {
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editNameModal'));
            myModal.hide();
            this.router.navigate(['profile']);
          }
        })
      }, (err: any) => {
        Swal.fire({
          title: 'Oops!',
          text: 'Your name was not updated.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: 'crimson'
        })
      });
    }
  }

}
