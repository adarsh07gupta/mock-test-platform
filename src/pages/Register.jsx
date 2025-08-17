import React, { useState } from 'react';

const Register = () => {
  const [step, setStep] = useState('details'); // details, otp, success
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock send OTP
  const sendOtp = async (email) => {
    setLoading(true);
    setError('');
    // Replace with real API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('otp');
  };

  // Mock verify OTP and register
  const verifyOtpAndRegister = async (email, otp, name, password) => {
    setLoading(true);
    setError('');
    // Replace with real API call
    await new Promise(r => setTimeout(r, 1000));
    if (otp === '123456') {
      setStep('success');
    } else {
      setError('Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f6f7fb'
    }}>
      <form
        style={{
          background: '#fff',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          minWidth: '320px'
        }}
        onSubmit={e => {
          e.preventDefault();
          if (step === 'details') sendOtp(email);
          else if (step === 'otp') verifyOtpAndRegister(email, otp, name, password);
        }}
      >
        <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>Register</h2>
        {step === 'details' && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                required
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
          </>
        )}
        {step === 'otp' && (
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              required
              onChange={e => setOtp(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
        )}
        {step === 'success' && (
          <div style={{
            marginBottom: '16px',
            color: 'green',
            textAlign: 'center'
          }}>
            Registration Successful!
          </div>
        )}
        {error && <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>}
        {(step === 'details' || step === 'otp') && (
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading
              ? (step === 'details' ? 'Sending OTP...' : 'Registering...')
              : (step === 'details' ? 'Send OTP' : 'Register')}
          </button>
        )}
      </form>
    </div>
  );
};

export default Register;
