import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(signUpForm: any) {
    if (signUpForm.value.password !== signUpForm.value.verifyPassword) {
      alert('Passwords do not match');
      return;
    }

    const employee = {
      firstName: signUpForm.value.firstName,
      lastName: signUpForm.value.lastName,
      email: signUpForm.value.email,
      password: signUpForm.value.password,
      permission: true
    };

    console.log('Form Data:', employee); // Debugging statement

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.http.post('http://localhost:8080/employee/signup', employee, { headers }).subscribe(
      (response) => {
        console.log('Employee registered successfully');
        // Redirect to another route after successful signup
        this.router.navigate(['/LogIn']); // Replace '/login' with your target route
      },
      (error) => {
        console.error('Error registering employee', error);
        alert('Error registering employee');
      }
    );
  }
}
