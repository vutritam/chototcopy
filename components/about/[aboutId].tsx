import { useRouter } from 'next/router';
import * as React from 'react';

export interface ICreateAboutByIdProps {
}

export default function App (props: ICreateAboutByIdProps) {
  const router  = useRouter()


  return (
    <div>
      create about post
      <p>Queries: {JSON.stringify(router.query)}</p>
    </div>
  );
}
