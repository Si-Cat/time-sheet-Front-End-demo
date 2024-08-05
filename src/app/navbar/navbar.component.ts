import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CookieService } from '../cookie.service'; // Adjust the path as necessary

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isActiveHome: boolean = true;
  isActiveStat: boolean = false;
  isActiveAdmin: boolean = false;
  @Input() inputData!: string;
  userEmail: string = '';
  isAdmin: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const email = this.cookieService.getCookie('userEmail');
    console.log('Cookie email:', email); // Debugging statement
    this.userEmail = email ? email : '';
  }

  handleLinkClick(message: string): void {
    if (message === 'Home') {
      this.isActiveHome = true;
      this.isActiveStat = false;
      this.isActiveAdmin = false;
    } else if (message === 'Stats') {
      this.isActiveHome = false;
      this.isActiveStat = true;
      this.isActiveAdmin = false;
    } else if (message === 'Admin') {
      this.isActiveHome = false;
      this.isActiveStat = false;
      this.isActiveAdmin = true;
    }
  }

  ngOnInit() {
    if (this.inputData) {
      this.handleLinkClick(this.inputData);
    }
    console.log("Email from cookie in ngOnInit:", this.userEmail);
    if (this.userEmail) {
      this.checkAdminPermission(this.userEmail);
    } else {
      console.log("No email found in cookie.");
    }
  }

  checkAdminPermission(email: string): void {
    console.log('Checking admin permission for email:', email); // Debugging statement
    const params = new HttpParams().set('email', email);
    this.http.get<{ permission: boolean }>(`http://localhost:8080/employee/permission`, { params })
      .subscribe(response => {
        console.log('Received response:', response); // Debugging statement
        this.isAdmin = response.permission;
      }, error => {
        console.error('Error fetching permission:', error);
      });
  }
}
