export default class CustomError extends Error {
  public statusCode: number;
  protected constructor(
    message: string,
    statusCode: number,
    public code?: number,
    public keyValue?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.keyValue = keyValue;
  }
}
