import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/userLoginSlice'; // Import loginUser from the slice
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const LoginPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, token } = useSelector((state) => state.userLogin);

    useEffect(() => {
        // Load saved credentials from local storage, if they exist
        const savedCredentials = localStorage.getItem('rememberedCredentials');
        if (savedCredentials) {
            const { email, password } = JSON.parse(savedCredentials);
            form.setFieldsValue({ email, password, remember: true });
        }
    }, [form]);

    useEffect(() => {
        if (error) {
            message.error(error.message || 'Login failed!');
        }
    }, [error]);

    useEffect(() => {
        if (token) {
            message.success('Login successful!');
            navigate('/');
        }
    }, [token, navigate]);

    const onFinish = (values) => {
        console.log('Received values:', values);
        setIsLoading(true);

        dispatch(loginUser({ email: values.email, password: values.password }))
            .unwrap() // Use .unwrap() to handle fulfilled and rejected cases directly
            .then((response) => {
                if (values.remember) {
                    // Save credentials to local storage if "Remember password?" is checked
                    localStorage.setItem('rememberedCredentials', JSON.stringify({
                        email: values.email,
                        password: values.password,
                    }));
                } else {
                    // Remove saved credentials if "Remember password?" is not checked
                    localStorage.removeItem('rememberedCredentials');
                }
                setIsLoading(false);
                navigate('/');
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                message.error('Incorrect email or password!');
            });
    };

    return (
        <>
            <Helmet>
                <title>Sign In - SportLinker</title>
            </Helmet>
            <div className={styles.loginPageContainer}>
                <div className={styles.leftSide}>
                    <div className={styles.loginHeader}>
                        <h1>Sign In</h1>
                    </div>
                    <div className={styles.loginForm}>
                        <Form
                            layout="vertical"
                            name="basic"
                            form={form}
                            onFinish={onFinish}
                            className={styles.formContainer}
                        >
                            <Form.Item
                                className={styles.formItem}
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your Email!' }
                                ]}
                            >
                                <Input className={styles.inputField} type="email" />
                            </Form.Item>

                            <Form.Item
                                className={styles.formItem}
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password className={styles.inputField} />
                            </Form.Item>

                            <div className={styles.formItemsContainer}>
                                <Form.Item name="remember" valuePropName="checked">
                                    <Checkbox className={styles.rememberCheckbox}>
                                        Remember password?
                                    </Checkbox>
                                </Form.Item>
                            </div>

                            <Form.Item className={styles.centerButton}>
                                <Button
                                    loading={isLoading}
                                    type="primary"
                                    htmlType="submit"
                                    className={styles.loginButton}
                                >
                                    Sign In
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className={styles.rightSide}></div>
            </div>
        </>
    );
};

export default LoginPage;
