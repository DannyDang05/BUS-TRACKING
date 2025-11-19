import * as React from 'react';
import './Login.scss';
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

const providers = [{ id: 'credentials', name: 'Username and password' }];

const signIn = async (provider, formData) => {
    // The underlying SignInPage uses an input named "email" by default.
    // To avoid changing the input name (and keep backend compatibility),
    // we read from the "email" field but treat it as the username here.
    const promise = new Promise((resolve) => {
        setTimeout(() => {
            const username = formData?.get('email'); // map email input -> username
            const password = formData?.get('password');
            alert(
                `Signing in with "${provider.name}" and credentials: ${username}, ${password}`,
            );
            resolve({
                type: 'CredentialsSignin',
                error: 'Invalid credentials.',
            });
        }, 300);
    });
    return promise;
};

const Login = () => {
    const theme = useTheme();
    return (
        <div className="login-root">
            <AppProvider theme={theme}>
                <SignInPage
                    signIn={signIn}
                    providers={providers}
                    slotProps={{
                        emailField: { label: 'Username', placeholder: 'likijoong1', autoFocus: true },
                        form: { noValidate: true }
                    }}
                />
            </AppProvider>
        </div>
    );
}

export default Login;
