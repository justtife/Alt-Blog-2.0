export default interface OutputResponse {
  message: string;
  data?: object;
  email?: "sent";
  token?: string;
  statusCode?: number;
  status: "success" | "failed";
}
