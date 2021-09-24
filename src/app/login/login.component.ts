import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb:FormBuilder, 
    private sharedService:SharedService,
    private router: Router,
    private snackBar:MatSnackBar
    ) {
    this.createForm();
  }

  ngOnInit() {
    if(localStorage.getItem('userId')){
      this.router.navigateByUrl('/dashboard');
      this.snackBar.open('You are already logged in!!', 'Close',  {verticalPosition:'top', duration:2000});
    }
  }

  createForm(){
    this.loginForm = this.fb.group({
      userId:['', [Validators.required]],
    })
  }

  getErrorMessage(control:AbstractControl){
    if(control.errors.required) return 'Required';
  }

  onSubmit(){
    this.sharedService.authenticateUser(this.loginForm.value)
    .then(res=>{
      if(res.success){
        this.router.navigateByUrl("/dashboard");
      }
      else{
        this.snackBar.open("Invalid User ID", 'Close', {verticalPosition:'top', duration:2000});
      }
    })
  }
}
