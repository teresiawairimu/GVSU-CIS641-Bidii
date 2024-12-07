import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, createUserWithEmailAndPassword } from '../firebaseConfig';
import { registerUser } from '../services/userServices';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Form, Container, Row, Col} from 'react-bootstrap';



const SignUpPage = () => {
  const [signupErrors, setSignupErrors] = useState([]);
  const { register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const ADMIN_INVITE_CODE = process.env.REACT_APP_ADMIN_INVITE_CODE;

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password);
      const user = userCredential.user;
      console.log("user:", user)
      const idToken = await user.getIdToken();
      console.log("id Token:", idToken);
      const role = data.invitecode === ADMIN_INVITE_CODE ? "admin" : "client";
      console.log("role", role);
      await registerUser({ 
        name: data.name,
        phone: data.phone, 
        email: data.email,
        role: role
      }, idToken);
      navigate('/login');
    } catch (error) {
        setSignupErrors([error.message])
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
          <Form onSubmit={handleSubmit(onSubmit)} className="p-4 shadow rounded bg-white">
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="name" 
                placeholder="name"
                {...register("name", { required: "Name is required"})} 
                />
                {errors.name && <p className="text-danger">{errors.name.message}</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="tel" 
                placeholder="phone"
                {...register("phone", {
                  required:"Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must be 10 digits",
                  }
                })}
              />
                {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Enter email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  }
                })}
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
              <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  }
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formInviteCode">
              <Form.Label>Admin Invite Code (optional)</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter invite code if applicable"
                {...register("invitecode")}
              />
            </Form.Group>

            {signupErrors.length > 0 && (
              <div className="text-danger">
                {signupErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <Button variant="primary" type="submit">
                Submit
            </Button>
            <div className="mt-3">
              <p>
                Already have an account? <Link to="/">Log in here</Link>.
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUpPage;
