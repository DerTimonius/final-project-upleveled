import { css } from '@emotion/react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getSessionByToken } from '../database/sessions';
import { User } from '../database/user';
import { formStyles } from '../styles/formStyles';
import { Error, RegisterResponseType } from './api/register';

export default function Register() {
  const [username, setUsername] = useState<User['username']>('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState<Error[]>([]);
  const router = useRouter();

  async function handleSubmit(
    event:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) {
    event.preventDefault();
    if (password1 === password2) {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password1 }),
      });
      const data: RegisterResponseType = await response.json();
      if ('errors' in data) {
        setErrors([...errors, data.errors]);
      }
      const returnTo = router.query.returnTo;
      if (
        returnTo &&
        !Array.isArray(returnTo) && // Security: Validate returnTo parameter against valid path
        // (because this is untrusted user input)
        /^\/[a-zA-Z0-9-?=/]*$/.test(returnTo)
      ) {
        return await router.push(returnTo);
      }

      /* // refresh the user on state
      await props.refreshUserProfile(); */
      // redirect user to user profile
      await router.push(`/movies`);
    }
    setErrors([
      ...errors,
      { message: 'Passwords not matching, please try again' },
    ]);
    setPassword1('');
    setPassword2('');
  }

  return (
    <>
      <Head>
        <title>Register user</title>
        <meta name="description" content="Register user" />
      </Head>
      <div css={formStyles}>
        <h4>Create an account and get started!</h4>
        {errors.length > 0
          ? errors.map((error) => {
              return <h5 key={`error ${error.message}`}>{error.message}</h5>;
            })
          : null}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <label htmlFor="password1">Password</label>
          <input
            type="password"
            id="password1"
            value={password1}
            onChange={(event) => setPassword1(event.currentTarget.value)}
          />
          <label htmlFor="password2">Repeat password</label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(event) => setPassword2(event.currentTarget.value)}
          />
          <button onClick={handleSubmit}>Create User</button>
        </form>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;

  if (token && (await getSessionByToken(token))) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
}
