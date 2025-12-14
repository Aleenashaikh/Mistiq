import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'mistiqperfumeries@gmail.com',
    pass: process.env.EMAIL_PASS || '', // App password should be set in .env
  },
});

// Send order notification to admin
export const sendOrderNotificationToAdmin = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mistiqperfumeries@gmail.com',
      to: 'mistiqperfumeries@gmail.com',
      subject: `New Order Received - ${order.orderNumber}`,
      html: `
        <h2>New Order Received</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
        <p><strong>Email:</strong> ${order.shippingAddress.email}</p>
        <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
        <p><strong>Total Amount:</strong> Rs ${order.totalAmount.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
        <p><strong>Status:</strong> ${order.status}</p>
        ${order.shippingAddress.nearestLandmark ? `<p><strong>Nearest Landmark:</strong> ${order.shippingAddress.nearestLandmark}</p>` : ''}
        <h3>Order Items:</h3>
        <ul>
          ${order.items.map(item => `
            <li>
              ${item.product.name || 'Product'} - 
              Quantity: ${item.quantity} - 
                Price: Rs ${item.price.toFixed(2)}
            </li>
          `).join('')}
        </ul>
        <h3>Shipping Address:</h3>
        <p>
          ${order.shippingAddress.street}<br>
          ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
          ${order.shippingAddress.country}
        </p>
        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order notification email sent to admin');
  } catch (error) {
    console.error('Error sending order notification to admin:', error);
  }
};

// Send order confirmation to customer
export const sendOrderConfirmationToCustomer = async (order, customerEmail) => {
  try {
    const mailOptions = {
      from: `"Mistiq Perfumeries" <${process.env.EMAIL_USER || 'mistiqperfumeries@gmail.com'}>`,
      to: customerEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d4af37;">Thank You for Your Order!</h2>
          <p>Dear ${order.shippingAddress.firstName},</p>
          <p>We've received your order and are preparing it for shipment.</p>
          
          <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="color: #000;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> Rs ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> Cash on Delivery (COD)</p>
            ${order.shippingAddress.nearestLandmark ? `<p><strong>Nearest Landmark:</strong> ${order.shippingAddress.nearestLandmark}</p>` : ''}
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <h3 style="color: #000;">Order Items:</h3>
          <ul>
            ${order.items.map(item => `
              <li style="margin: 10px 0;">
                ${item.product.name || 'Product'} - 
                Quantity: ${item.quantity} - 
                Price: Rs ${item.price.toFixed(2)}
              </li>
            `).join('')}
          </ul>

          <h3 style="color: #000;">Shipping Address:</h3>
          <p>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}
          </p>

          <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
          <p>If you have any questions, please contact us at mistiqperfumeries@gmail.com</p>
          
          <p style="margin-top: 30px; color: #666;">
            Best regards,<br>
            <strong>Mistiq Perfumeries</strong>
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to customer');
  } catch (error) {
    console.error('Error sending order confirmation to customer:', error);
  }
};

// Send feedback notification to admin
export const sendFeedbackNotificationToAdmin = async (feedback) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mistiqperfumeries@gmail.com',
      to: 'mistiqperfumeries@gmail.com',
      subject: `New Feedback Received - ${feedback.stars} Star${feedback.stars !== 1 ? 's' : ''}`,
      html: `
        <h2>New Feedback Received</h2>
        <p><strong>Name:</strong> ${feedback.name}</p>
        <p><strong>Email:</strong> ${feedback.email}</p>
        <p><strong>Rating:</strong> ${feedback.stars} / 5 stars</p>
        <p><strong>Comments:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; font-style: italic;">
          "${feedback.comments}"
        </p>
        <p><strong>Submitted:</strong> ${new Date(feedback.createdAt).toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Feedback notification email sent to admin');
  } catch (error) {
    console.error('Error sending feedback notification to admin:', error);
  }
};

// Send contact form notification to admin
export const sendContactNotificationToAdmin = async (contactData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mistiqperfumeries@gmail.com',
      to: 'mistiqperfumeries@gmail.com',
      subject: `New Contact Form Submission from ${contactData.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact form notification email sent to admin');
  } catch (error) {
    console.error('Error sending contact form notification to admin:', error);
  }
};

