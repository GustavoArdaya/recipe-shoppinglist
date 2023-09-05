import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { apiKey } from "src/ApiKey"
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})
export class AuthService {

    private key = apiKey.key;
    // user = new Subject<User>; // We can subscribe and get information when new data is added
    user = new BehaviorSubject<User>(null); // gives access to previous emited value even if not currently subscrived

    
    constructor(
        private http : HttpClient,
        private router: Router) {}
    
    signup(newEmail: string, newPassword: string) {
        return this.http
            .post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.key}`,
            {
                email: newEmail,
                password: newPassword,
                returnSecureToken: true
            })
            .pipe(catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn
                )
            }));
    }

    login(email: string, password: string ) {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.key}`, 
        {
            email: email,
            password: password,
            returnSecureToken: true
        })
        .pipe(catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn
            )
        }));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);

    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationdate = new Date(new Date().getTime() + expiresIn * 1000);
                const user = new User(
                    email, 
                    userId, 
                    token, 
                    expirationdate
                );
                this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
                if (!errorRes.error || !errorRes.error.error) {
                    return throwError(errorMessage);
                }
                switch (errorRes.error.error.message) {
                    case 'EMAIL_EXISTS':
                        errorMessage = 'This email exists already'; break;
                    case 'EMAIL_NOT_FOUND':
                        errorMessage = 'This email does not exist'; break;
                    case 'INVALID_PASSWORD':
                        errorMessage = 'Invalid password'; break;
                }
                return throwError(errorMessage);
    }
}