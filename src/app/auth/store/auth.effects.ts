import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as AuthActions from './auth.actions';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { apiKey } from "src/ApiKey";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable()
export class AuthEffects {

    private key = apiKey.key;
    
    authLogin = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.key}`, 
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                })
            .pipe(
                map(resData => {
                    const expirationdate = new Date(new Date().getTime() + (+resData.expiresIn) * 1000);
                    return new AuthActions.Login({
                        email: resData.email,
                        userId: resData.localId,
                        token: resData.idToken,
                        expirationdate: expirationdate});
                }),
                catchError(errorRes => {
                    let errorMessage = 'An unknown error occurred!';
                    if (!errorRes.error || !errorRes.error.error) {
                        return of(new AuthActions.LoginFail(errorMessage));
                    }
                    switch (errorRes.error.error.message) {
                        case 'EMAIL_EXISTS':
                            errorMessage = 'This email exists already'; break;
                        case 'EMAIL_NOT_FOUND':
                            errorMessage = 'This email does not exist'; break;
                        case 'INVALID_PASSWORD':
                            errorMessage = 'Invalid password'; break;
                    }
                    return of(new AuthActions.LoginFail( errorMessage ));
                })
            )}
        )
        )
    );
    
    authSuccess = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.LOGIN), 
        tap(() => {
            this.router.navigate(['/']);
        })), { dispatch: false }
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router) {}
}