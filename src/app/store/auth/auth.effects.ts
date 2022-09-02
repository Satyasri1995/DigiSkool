import { IUser } from './../../models/user';
import { AppState } from './../app.store';
import { createAccount, signInUser, storeUser, logoutUser } from './auth.actions';
import { AuthService } from './../../services/auth.service';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { redirectTo } from '../ui/ui.actions';
import { Store } from '@ngrx/store';


@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly store: Store<AppState>
  ) {}

  signupEffect = createEffect(() => {
    let userObj;
    return this.actions$.pipe(
      ofType(createAccount),
      switchMap((payload) => {
        return this.authService
          .createAccount(payload.mail, payload.password)
          .pipe(
            switchMap((result: any) => {
              const user = new User();
              user.mail = result.user.email;
              user.uid = result.user.uid;
              user.createdAt = result.user.metadata.createdAt;
              user.updatedAt = result.user.metadata.createdAt;
              userObj = user;
              return this.authService.addUser(user);
            }),
            mergeMap((result: any) => {
              return [
                storeUser({ user: userObj }),
                redirectTo({ page: '/admin-menu' })
              ];
            })
          );
      })
    );
  });

  signInEffect = createEffect(()=>{
    return this.actions$.pipe(
      ofType(signInUser),
      switchMap((payload)=>{
        return this.authService.signInUser(payload.mail,payload.password)
        .pipe(
          switchMap((result)=>{
            const uid = result.user.uid;
            return this.authService.getUserByUid(uid);
          }),
          mergeMap((userResult:IUser)=>{
            const user = new User(userResult);
            return [
              storeUser({user:user}),
              redirectTo({page:'/admin-menu'})
            ]
          })
        )
      })
    )
  });

  logoutEffect = createEffect(()=>{
    return this.actions$.pipe(
      ofType(logoutUser),
      switchMap(()=>{
        return this.authService.logout()
        .pipe(
          mergeMap(()=>{
            return [
              storeUser({user:new User()}),
              redirectTo({page:'/auth'}),
            ]
          })
        )
      })
    )
  })
}
