import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ContactUs = () => {
  const backgroundImage =
    "https://image.shutterstock.com/image-illustration/mail-background-600nw-258574940.jpg";

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div className="container bg-light p-5 rounded shadow-lg" style={{ maxWidth: "600px", opacity: 0.95 }}>
        <h2 className="text-center mb-4">Contact Us</h2>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Your Name</label>
            <input type="text" className="form-control" id="name" placeholder="Enter your name" />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input type="email" className="form-control" id="email" placeholder="Enter your email" />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea className="form-control" id="message" rows="4" placeholder="Enter your message"></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">Send Message</button>
      </div>
    </div>
  );
};

export default ContactUs;
