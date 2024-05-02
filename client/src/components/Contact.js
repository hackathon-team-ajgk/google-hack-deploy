import { useState } from "react";

function Contact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form className="contact-us">
      <h2 id="form-heading">Get in Touch</h2>
      <div className="form-field">
        <input
          id="first-name-input"
          className="contact-input"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          id="last-name-input"
          className="contact-input"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="form-field">
        <input
          id="email-input"
          className="contact-input"
          type="email"
          placeholder="Email"
          autoComplete="current-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          id="phone-input"
          className="contact-input"
          type="text"
          placeholder="Phone Number"
          pattern="[0-9]{10}"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <input
        id="address-input"
        className="contact-input"
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <textarea
        id="contact-textarea"
        className="form-textarea"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" id="contact-button" className="button">
        Submit
      </button>
    </form>
  );
}

export default Contact;
