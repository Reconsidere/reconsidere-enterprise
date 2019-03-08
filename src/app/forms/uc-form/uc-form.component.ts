import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as messages from 'message.code.json';

@Component({
  selector: 'app-uc-form',
  templateUrl: './uc-form.component.html',
  styleUrls: ['./uc-form.component.scss']
})
export class UcFormComponent implements OnInit {

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }

  save() {
    this.toastr.success(
      messages["SUCCESS"]["SRE002"]["message"], 
      messages["SUCCESS"]["SRE002"]["summary"]
    );
    this.toastr.error(
      messages["SUCCESS"]["SRE002"]["message"], 
      messages["SUCCESS"]["SRE002"]["summary"]
    );
    this.toastr.error(
      messages["SUCCESS"]["SRE002"]["message"], 
      messages["SUCCESS"]["SRE002"]["summary"]
    );
  }''

}
