import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Claim } from 'src/app/models/claim';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-claims-edit',
  templateUrl: './claims-edit.component.html',
  styleUrls: ['./claims-edit.component.scss']
})
export class ClaimsEditComponent implements OnInit {
  public form = this.fb.group({
    truthfulness: [this.dialogData.truthfulness],
  });

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ClaimsEditComponent>, @Inject(MAT_DIALOG_DATA) private dialogData: Claim) { }

  ngOnInit(): void {
  }

}
