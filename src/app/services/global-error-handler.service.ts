import { toggleLoading } from './../store/ui/ui.actions';
import { ErrorHandler, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private readonly toast: ToastController,private readonly store:Store) {}
  async handleError(error: any): Promise<void> {
    const code = error.code;
    const message = error.message;

      if(code==='auth/user-not-found'){
        const toast = await this.toast.create({
          header: 'INVALID MAIL-ID',
          message: 'There is no user record corresponding to this Mail-ID',
          color: 'danger',
          buttons: ['ok'],
        });
        toast.present();
      }else if(code==='auth/network-request-failed'){
        const toast = await this.toast.create({
          header: 'AUTH FAILED',
          message: 'Error such as timeout, interrupted connection or unreachable host occured',
          color: 'danger',
          buttons: ['ok'],
        });
        toast.present();
      }else{
        console.log(error)
      }
      this.store.dispatch(toggleLoading({loading:false}))
  }
}
