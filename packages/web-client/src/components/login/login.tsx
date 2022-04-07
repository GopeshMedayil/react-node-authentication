import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';


const Login = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [user, setUser] = useState<any>({});

    const handleSubmit = (values: any) => {
        console.log(values);

        axios.post('http://localhost:3002/auth/', values)
            .then((response: any) => {
                console.log(response);
                // setUser(response.data);
            })
            .catch(error => {

            })
            .finally(() => {

            });
    }

    useEffect(() => {
        return inputRef.current?.focus();
    }, []);



    return (
        <div>

            <h1>Login</h1>
            <Formik
                initialValues={{ user: '', pwd: '' }}
                validationSchema={
                    Yup.object({
                        pwd: Yup.string().required('Required'),
                        user: Yup.string().email('Invalid email address').required('Required'),
                    })}
                onSubmit={handleSubmit}
            >
                <Form>
                    <label htmlFor="user">Email Address</label>
                    <Field name="user" type="email" innerRef={inputRef} />
                    <ErrorMessage name="user" />
                    <br />
                    <label htmlFor="password">Password</label>
                    <Field name="pwd" type="password" />
                    <ErrorMessage name="pwd" />
                    <br />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div>
    )
}

export default Login;