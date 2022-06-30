import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loginForm:any = FormGroup;
  responseMessage:any;
  // constructor(private formBuilder:FormBuilder,
  //   private router:Router,
  //   private userService: UserService,
  //   private snackbarService: SnackbarService,
  //   // private dialogRef:MatDialogRef<LoginComponent>,
  //   private ngxService:NgxUiLoaderService

  constructor(private dialog:MatDialog,
    private formBuilder:FormBuilder,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private ngxService:NgxUiLoaderService,
    private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]]
    })
  }

  // signupAction1(){
  //   console.log("test");
  //   this.router.navigate(['/signup']);
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = "550px";
    // this.dialog.open(SignupComponent,dialogConfig);
  // }


  forgotPasswordAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width="550px";
    dialogConfig.position = {
      'top': '0',
      left: '0'
  };
    this.dialog.open(ForgotPasswordComponent,dialogConfig);

  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password:formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
      this.ngxService.stop();
      // this.dialogRef.close();
      window.localStorage.setItem('token',response.token);
      this.router.navigate(['/dashboard']);
    },(error)=>{
      this.ngxService.stop()
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  // loginAction() {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.width = "550px";
  //   this.dialog.open(LoginComponent,dialogConfig);
  // }

}
