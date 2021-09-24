import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;

  constructor(
    private fb:FormBuilder, 
    private sharedService:SharedService,
    private router:Router,
    private snackBar:MatSnackBar
    ) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm(){
    this.registerForm = this.fb.group({
      userId:['', [Validators.required]],
      name: ['', [Validators.required]]
    })
  }

  getErrorMessage(control:AbstractControl){
    if(control.errors.required) return 'Required';
  }

  onSubmit(){
    if(this.registerForm.valid){
      this.sharedService.registerUser(this.registerForm.value)
      .then(res=>{
        if(!res.success){
          this.snackBar.open(res.status, 'Close', {verticalPosition:'top', duration:2000});
        }
        else{
          this.snackBar.open('Successfully Registered. Please login!', 'Close', {verticalPosition:'top', duration:2000});
          this.router.navigateByUrl('');
        }
      })
    }
  }

}
