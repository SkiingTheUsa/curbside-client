import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  RequiredValidator,
  Validators,
} from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState, selectAllPolling } from 'src/app/reducers';
import * as actions from '../../actions/polling.actions';
import { PollingEntity } from 'src/app/reducers/polling.reducer';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-polling',
  templateUrl: './polling.component.html',
  styleUrls: ['./polling.component.scss'],
})
export class PollingComponent implements OnInit {
  theForm: FormGroup;
  orders$: Observable<PollingEntity[]>;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>
  ) {
    this.theForm = this.getForm();
  }

  getForm() {
    return this.formBuilder.group({
      for: ['', [Validators.required]],
      items: this.formBuilder.array([this.formBuilder.control('')]),
    });
  }
  get for() {
    return this.theForm.get('for');
  }

  get items() {
    return this.theForm.get('items') as FormArray;
  }

  addItem() {
    this.items.push(this.formBuilder.control(''));
  }

  ngOnInit(): void {
    this.orders$ = this.store.pipe(select(selectAllPolling));
  }

  submit() {
    if (this.theForm.valid && this.items.length >= 1) {
      this.store.dispatch(actions.curbsideOrderAdded(this.theForm.value));
      this.theForm = this.getForm();
    }
  }

  refresh(id: string) {
    this.store.dispatch(actions.refreshItem({ id }));
  }
}
