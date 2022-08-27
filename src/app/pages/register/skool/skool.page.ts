import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skool',
  templateUrl: './skool.page.html',
  styleUrls: ['./skool.page.scss'],
})
export class SkoolPage implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit() {
  }

  onSubmit(){
    this.router.navigate(['/profile']);
  }

}
