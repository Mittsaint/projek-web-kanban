// src/pages/ContactSupportPage.jsx
import React, { useState } from 'react';
import { sendContactForm } from '../services/contactService'; // Adjust the path if necessary

// Reusable component for form fields
const FormField = ({ id, label, type, value, onChange, isTextArea = false }) => {
  const commonProps = {
    id: id,
    name: id,
    value: value,
    onChange: onChange,
    className: "w-full py-2 px-4 mt-2 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition",
    required: true,
  };

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      {isTextArea ? (
        <textarea {...commonProps} rows="5" placeholder={`Your ${label.toLowerCase()}...`}></textarea>
      ) : (
        <input {...commonProps} type={type} placeholder={`Your ${label.toLowerCase()}...`} />
      )}
    </div>
  );
};


const ContactSupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      // Call the service function to send data to the backend
      await sendContactForm(formData);
      
      setStatus('success');
      alert('Your message has been sent successfully!');
      
      // Reset form after successful submission
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('error');
      alert('Sorry, there was an error sending your message. Please try again later.');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <div className="w-full flex flex-col flex-grow p-4 sm:p-6 lg:p-8 bg-gray-900 text-white min-h-0">
      <div className="max-w-2xl mx-auto w-full">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact Support
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Have questions or need help? Fill out the form below to get in touch with our team.
          </p>
        </header>

        {/* Contact Form */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <FormField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormField
              id="message"
              label="Message"
              value={formData.message}
              onChange={handleChange}
              isTextArea={true}
            />
            <div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;