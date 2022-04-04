import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useEffect, useRef } from 'react';
import * as Yup from 'yup';


const Login = () => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return inputRef.current?.focus();
    }, []);

    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={
                    Yup.object({
                        password: Yup.string().required('Required'),
                        email: Yup.string().email('Invalid email address').required('Required'),
                    })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                    }, 400);
                }}
            >
                <Form>
                    <label htmlFor="email">Email Address</label>
                    <Field name="email" type="email" innerRef={inputRef} />
                    <ErrorMessage name="email" />

                    <label htmlFor="password">Password</label>
                    <Field name="password" type="password" />
                    <ErrorMessage name="password" />

                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login;