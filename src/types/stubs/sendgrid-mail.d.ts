declare module '@sendgrid/mail' {
  export interface Address {
    email: string;
    name?: string;
  }

  export interface MailAttachment {
    content: string; // base64 content
    filename: string;
    type?: string;
    disposition?: 'attachment' | 'inline';
    content_id?: string;
  }

  export interface MailDataRequired {
    to: string | Address | Array<string | Address>;
    from: string | Address;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string | Address;
    attachments?: MailAttachment[];
    categories?: string[];
    headers?: Record<string, string>;
    customArgs?: Record<string, string>;
    templateId?: string;
    dynamicTemplateData?: Record<string, unknown>;
    mailSettings?: { sandboxMode?: { enable?: boolean } };
    trackingSettings?: {
      clickTracking?: { enable?: boolean; enableText?: boolean };
      openTracking?: { enable?: boolean };
    };
    content?: Array<{ type: string; value: string }>;
  }

  export class MailService {
    setApiKey(apiKey: string): void;
    send(data: MailDataRequired | MailDataRequired[], isMultiple?: boolean): Promise<unknown>;
  }

  const mail: MailService;
  export default mail;
}
