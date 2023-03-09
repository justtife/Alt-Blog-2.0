import { nodemailerConfig } from "../../config/nodemailerConfig";
import { MailOptions } from "./mail-interface";
import config from "../../config/config";
import NodeMailer from "nodemailer";
import path from "path";
import fs from "fs";

export default class MailService {
  private transporter: NodeMailer.Transporter;
  constructor() {
    this.transporter = NodeMailer.createTransport(nodemailerConfig);
  }
  /**
   *
   * @param options
   */
  private async sendMail(options: MailOptions): Promise<void> {
    await this.transporter.sendMail({
      from: config.MAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  }
  /**
   *
   * @param to
   * @param name
   */
  async sendWelcomeMail(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "welcome.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Welcome to AltBlog",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   * @param passwordToken
   */
  async resetPasswordMail(
    to: string,
    name: string,
    passwordToken: string
  ): Promise<void> {
    const filePath = path.join(__dirname, "templates", "forgot-password.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const url = `http://localhost:${config.port}/api/v1/create-password?passwordToken=${passwordToken}`;
    const renderedHtml = html.replace("{name}", name).replace("{url}", url);
    const options: MailOptions = {
      to: to,
      subject: "Reset Password",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async flagAccount(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "flag-account.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Your account has been flagged",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async unflagAccount(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "unflag-account.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Your account has been unflagged",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async goodBye(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "goodbye.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Your account has been deleted",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async passwordChanged(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "password-changed.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Your has been changed",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   * @param description
   * @param title
   * @param author
   * @param image
   * @param article
   */
  async publishReminder(
    to: string,
    name: string,
    description: string,
    title: string,
    author: string,
    image: string,
    article: string
  ): Promise<void> {
    const filePath = path.join(__dirname, "templates", "publish-reminder.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const url = `http://localhost:${config.port}/api/v1/article/${article}`;
    const renderedHtml = html
      .replace("{name}", name)
      .replace("{description}", description)
      .replace("{title}", title)
      .replace("{author}", author)
      .replace("{image}", image)
      .replace("{url}", url);
    const options: MailOptions = {
      to: to,
      subject: `${author} just published a new article titled ${title}`,
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async subExpired(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "sub-expired.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Your Subscriptio has expired",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
  /**
   *
   * @param to
   * @param name
   */
  async subReminder(to: string, name: string): Promise<void> {
    const filePath = path.join(__dirname, "templates", "sub-reminder.htm");
    const html = await fs.promises.readFile(filePath, "utf-8");
    const renderedHtml = html.replace("{name}", name);
    const options: MailOptions = {
      to: to,
      subject: "Subscription Reminder Mail",
      html: renderedHtml,
    };
    await this.sendMail(options);
  }
}
