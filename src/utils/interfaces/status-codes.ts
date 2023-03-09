export enum StatusCode {
  BAD_REQUEST = 400,
  OK = 200,
  CREATED = 201,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  UNSUPPORTED_MEDIA_TYPE = 415,
  TOO_MANY_REQUEST = 429,
  NOT_FOUND = 404,
  PAYMENT_REQUIRED = 402,
  SERVICE_UNAVAILABLE = 503,
  NO_CONTENT = 204,
  FOUND = 302,
  LOCKED = 423, //Suspended Account
  NETWORK_AUTHENTICATION_REQUIRED = 511,
}
