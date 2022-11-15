import cookie from 'cookie';
import { GetServerSidePropsContext } from 'next';
import { deleteSessionByToken } from '../database/sessions';

export default function Logout() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const token = context.req.cookies.sessionToken;
  if (token) {
    await deleteSessionByToken(token);
    context.res.setHeader('Set-Cookie', [
      cookie.serialize('selectedMovie', '', {
        maxAge: -1,
        path: '/',
      }),
      cookie.serialize('sessionToken', '', {
        maxAge: -1,
        path: '/',
      }),
    ]);
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
}
