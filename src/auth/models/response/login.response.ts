export class LoginResponse {
  token: string;
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
  }
}
