import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {

  constructor(private ds: DataService, private router: Router, private user: UserService) { }

  loginState = this.user.isLoggedIn();

  updateContactForm = new FormGroup({
    acc_mobile: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(11), Validators.minLength(11)]),
  });

  isSubmitted = false;

  ngOnInit(): void {
  }

  get f(){
    return this.updateContactForm.controls;
  }

  acc_mobile: any;
  acc_contact: any = {};

  submitForm() {
    this.isSubmitted = true;
    if (!this.updateContactForm.valid) {
      Swal.fire({
        title: 'Oops!',
        text: 'Please provide all the required details.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: 'crimson'
      })
      return false;
    } else {
      console.log(this.updateContactForm.value)
      let pload = JSON.parse(atob(window.sessionStorage.getItem(btoa('payload')) || '{}'));
      this.ds.sendApiRequest("updateProfile/" + pload.id, this.updateContactForm.value).subscribe((data: { payload: any[]; }) => {
        Swal.fire({
          title: 'Success!',
          text: 'Contact updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: 'forestgreen'
        }).then((result) => {
          if (result.isConfirmed) {
            var myModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('editContactModal'));
            myModal.hide();
            this.router.navigate(['profile']);
          }
        })
      }, (err: any) => {
  
      });
    }
  }

}
