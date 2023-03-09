import config from "./config";
export let nodemailerConfig = {
  service: config.MAIL_SERVICE,
  auth: {
    user: config.MAIL_USER,
    pass: config.NODEMAILER_PASS,
  },
};
