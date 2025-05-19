import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminsService {
  constructor(private _HttpClient: HttpClient) {}
  private URL = environment.backUrl;
  addAdmin(adminData: {}) {
    return this._HttpClient.post(
      `${this.URL}/auth/register`,
      { ...adminData, role: 'admin' },
      {
        withCredentials: true,
      }
    );
  }
  getAdminbyId(id: string) {
    return this._HttpClient.put(`${this.URL}/user/${id}`, {
      withCredentials: true,
    });
  }

  deleteAdmin(id: string) {
    // /users/:id
    return this._HttpClient.delete(`${this.URL}/users/${id}`, {
      withCredentials: true,
    });
  }
  getAdmins(page: number = 1, limit: number = 6) {
    return this._HttpClient.get(
      `${this.URL}/users?role=admin&page=${page}&limit=${limit}`,
      {
        withCredentials: true,
      }
    );
  }
  UpdateAdmins(id: string, updatedData: {}) {
    return this._HttpClient.put(
      `${this.URL}/users/me`,
      { ...updatedData },
      {
        withCredentials: true,
      }
    );
  }
}
