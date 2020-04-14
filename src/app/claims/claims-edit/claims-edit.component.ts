import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Claim } from 'src/app/models/claim';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-claims-edit',
  templateUrl: './claims-edit.component.html',
  styleUrls: ['./claims-edit.component.scss'],
})
export class ClaimsEditComponent implements OnInit {
  public form = this.fb.group({
    truthfulness: [this.claim.truthfulness, [Validators.required]],
    factCheckerLinks: this.fb.array(this.claim.factCheckerLinks, [
      Validators.required,
    ]),
  });
  public updating: boolean;

  get factCheckerLinksFormArray() {
    return this.form.get('factCheckerLinks') as FormArray;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public claim: Claim,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClaimsEditComponent>,
    private db: AngularFirestore,
  ) {}

  ngOnInit(): void {}

  addLink(): void {
    this.factCheckerLinksFormArray.push(
      this.fb.control('', [Validators.required]),
    );
  }

  async updateClaim(): Promise<void> {
    this.updating = true;

    try {
      await this.db.doc(`claims/${this.claim.id}`).update(this.form.value);
    } finally {
      this.updating = false;
    }

    this.dialogRef.close();
  }
}
