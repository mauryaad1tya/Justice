import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHospital, FaEnvelope, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaBuilding, FaMapMarked } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import '../../styles/register.css';

const HospitalRegister = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // User name
    phone: '',
    role: 'hospital',
    hospitalName: '',
    address: {
      street: '',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560024',
      country: 'India'
    },
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // Default coordinates for Bangalore
    },
    active: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prevState => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    const index = name === 'longitude' ? 0 : 1;
    const newCoordinates = [...formData.location.coordinates];
    newCoordinates[index] = parseFloat(value) || 0;
    
    setFormData(prevState => ({
      ...prevState,
      location: {
        ...prevState.location,
        coordinates: newCoordinates
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrors({});
    setSuccess('');
    
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.name) newErrors.name = 'Your name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.hospitalName) newErrors.hospitalName = 'Hospital name is required';
    if (!formData.address.street) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city) newErrors['address.city'] = 'City is required';
    if (!formData.address.state) newErrors['address.state'] = 'State is required';
    if (!formData.address.zipCode) newErrors['address.zipCode'] = 'ZIP code is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await register(
        formData.email,
        formData.password,
        'hospital',
        {
          name: formData.name,
          phone: formData.phone,
          hospitalName: formData.hospitalName,
          address: formData.address,
          location: formData.location
        }
      );
      
      if (success) {
        setSuccess(`Hospital "${formData.hospitalName}" registered successfully! Redirecting to dashboard...`);
        setRegistrationComplete(true);
        
        // Delay navigation to show success message
        setTimeout(() => {
          navigate('/hospital/dashboard');
        }, 2000);
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <Container>
        <div className="register-container">
          <div className="register-header">
            <div className="register-icon">
              <FaHospital size={32} />
            </div>
            <h1>Hospital Registration</h1>
            <p>Join the Justice Emergency Response System</p>
          </div>
          
          {errors.general && (
            <Alert variant="danger" className="register-alert">
              {errors.general}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="register-alert">
              <FaCheckCircle className="me-2" />
              {success}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit} className="register-form">
            <h4 className="section-title">Account Information</h4>
            <Row>
              <Col lg={12} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaBuilding className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="hospitalName"
                    name="hospitalName"
                    placeholder=" "
                    value={formData.hospitalName}
                    onChange={handleChange}
                    isInvalid={!!errors.hospitalName}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="hospitalName">Hospital Name</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.hospitalName}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col lg={12} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaUser className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="name"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!errors.name}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="name">Your Name</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaEnvelope className="input-icon" />
                  </div>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="email">Email Address</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaPhone className="input-icon" />
                  </div>
                  <Form.Control
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder=" "
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="phone">Phone Number</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaLock className="input-icon" />
                  </div>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    placeholder=" "
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaLock className="input-icon" />
                  </div>
                  <Form.Control
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder=" "
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Row>
            
            <h4 className="section-title">Address Information</h4>
            <Row>
              <Col lg={12} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="address.street"
                    name="address.street"
                    placeholder=" "
                    value={formData.address.street}
                    onChange={handleChange}
                    isInvalid={!!errors['address.street']}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="address.street">Street Address</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors['address.street']}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="address.city"
                    name="address.city"
                    placeholder=" "
                    value={formData.address.city}
                    onChange={handleChange}
                    isInvalid={!!errors['address.city']}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="address.city">City</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors['address.city']}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="address.state"
                    name="address.state"
                    placeholder=" "
                    value={formData.address.state}
                    onChange={handleChange}
                    isInvalid={!!errors['address.state']}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="address.state">State</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors['address.state']}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    placeholder=" "
                    value={formData.address.zipCode}
                    onChange={handleChange}
                    isInvalid={!!errors['address.zipCode']}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="address.zipCode">ZIP Code</Form.Label>
                  <Form.Control.Feedback type="invalid">
                    {errors['address.zipCode']}
                  </Form.Control.Feedback>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarkerAlt className="input-icon" />
                  </div>
                  <Form.Control
                    type="text"
                    id="address.country"
                    name="address.country"
                    placeholder=" "
                    value={formData.address.country}
                    onChange={handleChange}
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="address.country">Country</Form.Label>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarked className="input-icon" />
                  </div>
                  <Form.Control
                    type="number"
                    id="longitude"
                    name="longitude"
                    placeholder=" "
                    value={formData.location.coordinates[0]}
                    onChange={handleCoordinateChange}
                    step="0.000001"
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="longitude">Longitude</Form.Label>
                </div>
              </Col>
              
              <Col md={6} className="mb-4">
                <div className="form-floating custom-form-floating">
                  <div className="input-icon-wrapper">
                    <FaMapMarked className="input-icon" />
                  </div>
                  <Form.Control
                    type="number"
                    id="latitude"
                    name="latitude"
                    placeholder=" "
                    value={formData.location.coordinates[1]}
                    onChange={handleCoordinateChange}
                    step="0.000001"
                    className="custom-form-control"
                  />
                  <Form.Label htmlFor="latitude">Latitude</Form.Label>
                </div>
              </Col>
            </Row>
            
            <Button 
              type="submit" 
              className="register-button" 
              disabled={isLoading || registrationComplete}
            >
              {isLoading ? (
                <>
                  <Loader small />
                  <span className="ms-2">Registering...</span>
                </>
              ) : registrationComplete ? (
                <>
                  <FaCheckCircle className="me-2" />
                  <span>Registration Complete!</span>
                </>
              ) : (
                <>
                  <span>Register Hospital</span>
                  <FaCheckCircle />
                </>
              )}
            </Button>
            
            <div className="register-footer">
              <p>Already have an account?</p>
              <Link to="/hospital/login" className="login-link">
                Login to your account
              </Link>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default HospitalRegister;
