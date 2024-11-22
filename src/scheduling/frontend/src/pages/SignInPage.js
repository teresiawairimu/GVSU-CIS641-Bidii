import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {auth, signInWithEmailAndPassword} from '../firebaseConfig';
import {useNavigate, Link} from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';


const SignInPage = () => {
    const [signinErrors, setSigninErrors] = useState([]);
    const { register, handleSubmit, formState: { errors }} = useForm();
    const navigate = useNavigate();
    const { userRole } = useAuth();

    const onSubmit = async (data) => {
        try {
            await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            if (userRole === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setSigninErrors([error.message])
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="FormBasicEmail">
                <Form.Label>Email Address</Form.Label>
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
            {signinErrors.length > 0 && (
                <div className="text-danger">
                    {signinErrors.map((error, index) => (
                        <p key={index}>{error}</p>
                    ))}
                </div>
            )}
            <Button variant="primary" type="submit">
                Submit
            </Button>
            <div className="mt-3">
                <p>
                    Don't have an account? <Link to="/signup">Signup here</Link>.
                </p>
            </div>
        </Form>
    )
};

export default SignInPage;