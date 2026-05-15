import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  signOut,
  signInWithPopup,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  User,
  UserCredential,
} from 'firebase/auth';
import { HttpService } from './http.service';
import { firebaseConfig } from '../firebase/firebase.config';

export interface CurrentUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpService);
  private readonly platformId = inject(PLATFORM_ID);
  private auth: Auth | null = null;

  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<CurrentUser | null>(null);
  private readonly tokenState = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeFirebase();
      this.restoreToken();
      this.setupAuthListener();
    }

    effect(() => {
      if (this.currentUser()) {
        void this.syncWithBackend();
      }
    });
  }

  private initializeFirebase(): void {
    try {
      initializeApp(firebaseConfig);
      this.auth = getAuth();
    } catch (error) {
      console.error('Firebase initialization failed:', error);
    }
  }

  private setupAuthListener(): void {
    if (!this.auth) return;

    const unsubscribe = this.auth.onAuthStateChanged((user: User | null) => {
      if (user) {
        this.isAuthenticated.set(true);
        this.currentUser.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
        });
      } else {
        this.isAuthenticated.set(false);
        this.currentUser.set(null);
        this.tokenState.set(null);
        this.removeStorageItem('accessToken');
      }
    });
  }

  async loginWithGoogle(): Promise<UserCredential | null> {
    if (!this.auth) return null;

    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    try {
      const result = await signInWithPopup(this.auth, provider);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  }

  async loginWithMicrosoft(): Promise<UserCredential | null> {
    if (!this.auth) return null;

    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('openid');
    provider.addScope('profile');
    provider.addScope('email');

    try {
      const result = await signInWithPopup(this.auth, provider);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Microsoft login failed:', error);
      throw error;
    }
  }

  async loginWithFacebook(): Promise<UserCredential | null> {
    if (!this.auth) return null;

    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');

    try {
      const result = await signInWithPopup(this.auth, provider);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  }

  async loginAnonymous(): Promise<UserCredential | null> {
    if (!this.auth) return null;

    try {
      const result = await signInAnonymously(this.auth);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Anonymous login failed:', error);
      throw error;
    }
  }

  async loginWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential | null> {
    if (!this.auth) return null;

    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    }
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<UserCredential | null> {
    if (!this.auth) return null;

    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      await this.saveToken(result.user);
      return result;
    } catch (error) {
      console.error('Email registration failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.auth) return;

    try {
      await signOut(this.auth);
      this.tokenState.set(null);
      this.removeStorageItem('accessToken');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  getToken(): string | null {
    return this.tokenState();
  }

  private async saveToken(user: User): Promise<void> {
    try {
      const token = await user.getIdToken();
      this.tokenState.set(token);
      this.setStorageItem('accessToken', token);
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  private restoreToken(): void {
    const token = this.getStorageItem('accessToken');
    if (token) {
      this.tokenState.set(token);
    }
  }

  private async syncWithBackend(): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    try {
      // TODO: Uncomment when backend endpoint is ready
      // await this.http.post('auth/firebase/sync', {
      //   uid: user.uid,
      //   email: user.email,
      //   displayName: user.displayName,
      // }).toPromise();
      console.log('Firebase user synced:', user.uid);
    } catch (error) {
      console.warn('Backend sync failed (non-blocking):', error);
    }
  }

  private getStorageItem(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem(key);
  }

  private setStorageItem(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(key);
  }
}

