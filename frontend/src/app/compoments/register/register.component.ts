
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';


class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    const regex= /\d/;

    if(regex.test(control.value) && control.value !== null) {
      return {};
    } else {
      return {passwordInvalid: true};
    }
  }

  static passwordsMatch(control: AbstractControl): ValidationErrors {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;

      if (password === confirmPassword && password !== null && confirmPassword !== null) {
        return {};
      } else {
        return { passwordsNotMatching: true };
      }
    } else {
      return {};
    }
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit  {
  registerForm: FormGroup | any;
  constructor(
    private authService : AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
  ){}
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name:[null, [Validators.required]],
      username:[null, [Validators.required]],
      email:[null, [
        Validators.required,
        Validators.email,
        Validators.minLength(6)]],
        password:[null, [
          Validators.required,
        Validators.minLength(3),
        CustomValidators.passwordContainsNumber
      ]],
        passwordConfirm:[null,[Validators.required]]
      },{
        validators: CustomValidators.passwordsMatch
      })
}

onSubmit() {
  if(this.registerForm.invalid){
    return;
  }
  this.authService.register(this.registerForm.value).pipe(
    map( user => this.router.navigate(['login']))
  ).subscribe();
}

}
