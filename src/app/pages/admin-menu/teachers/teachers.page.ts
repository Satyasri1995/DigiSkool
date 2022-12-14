import { RegisterIdSelector } from './../../../store/register/register.selector';
import {
  setEditTeachers,
  getTeachers,
  getSchedule,
  clearTeacher,
} from './../../../store/teacher/teacher.action';
import { ITeacher } from './../../../models/teacher';
import { AppState } from 'src/app/store/app.store';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RemoveTeacherComponent } from '../../../widgets/remove-teacher/remove-teacher.component';
import { AddTeacherComponent } from './../../../widgets/add-teacher/add-teacher.component';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { TeacherSelector } from './../../../store/teacher/teacher.selector';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.page.html',
  styleUrls: ['./teachers.page.scss'],
})
export class TeachersPage implements OnInit, OnDestroy {
  teacherSub: Subscription;
  teachers: ITeacher[];
  regId: string;
  regSub: Subscription;

  constructor(
    private readonly modal: ModalController,
    private readonly store: Store<AppState>
  ) {}

  ngOnInit() {
    this.teacherSub = this.store
      .pipe(map((state) => TeacherSelector(state)))
      .subscribe((result) => {
        this.teachers = result.teachers;
      });
    this.regSub = this.store
      .pipe(map((state) => RegisterIdSelector(state)))
      .subscribe((id) => {
        this.regId = id;
      });
  }

  async addTeacher() {
    this.store.dispatch(clearTeacher())
    const modal = await this.modal.create({
      component: AddTeacherComponent,
    });
    modal.present();
  }

  viewTeacherData(teacher: ITeacher) {
    this.store.dispatch(setEditTeachers({ teacher }));
    this.store.dispatch(getSchedule({ rid: this.regId, tid: teacher.id }));
  }

  async removeTeacher() {
    const modal = await this.modal.create({
      component: RemoveTeacherComponent,
    });
    modal.present();
    console.log('remove');
  }

  ngOnDestroy(): void {
    this.teacherSub.unsubscribe();
  }
}
