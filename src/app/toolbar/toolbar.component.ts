import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {


  constructor(public auth: AuthService) { }

  ngOnInit() {
  }




}
