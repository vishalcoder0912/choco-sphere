// Email notification utilities
// This is a placeholder for email notification integration
// In a real application, this would integrate with services like SendGrid, Mailgun, or AWS SES

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async (data: EmailData): Promise<void> => {
  // Placeholder for email sending logic
  // In production, this would call your backend API which handles email sending
  console.log("Email would be sent:", data);
};

export const emailTemplates = {
  orderConfirmation: (orderData: any) => ({
    subject: `Order Confirmation - Order #${orderData.id}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order #${orderData.id}</p>
      <p>Total: ₹${(orderData.totalAmount / 100).toFixed(2)}</p>
    `,
  }),
  
  orderShipped: (orderData: any) => ({
    subject: `Your order has been shipped! - Order #${orderData.id}`,
    html: `
      <h1>Your order is on the way!</h1>
      <p>Order #${orderData.id}</p>
      <p>Track your order for updates.</p>
    `,
  }),

  welcomeEmail: (userData: any) => ({
    subject: "Welcome to NoirSane!",
    html: `
      <h1>Welcome to NoirSane!</h1>
      <p>Thank you for joining us. Enter the shadows and explore our forbidden collection.</p>
    `,
  }),
  
  passwordReset: (resetLink: string) => ({
    subject: "Reset Your Password",
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
    `,
  }),
};

export const triggerEmailNotification = async (
  type: keyof typeof emailTemplates,
  data: any,
  recipientEmail: string
): Promise<void> => {
  const template = emailTemplates[type](data);
  await sendEmail({
    to: recipientEmail,
    subject: template.subject,
    html: template.html,
  });
};
