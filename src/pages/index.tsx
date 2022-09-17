import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Space Traveling | Rocketseat</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <h1>
            <img src="/images/logo.svg" alt="space travelin" /> spacetraveling
            <span>.</span>
          </h1>
        </section>
        <article className={styles.posts}>
          <div>
            <Link href="/">
              <a>
                <h2>Como utilizar Hooks</h2>
                <div>Pensando em sincronização em vez de ciclos de vida. </div>
                <div className={styles.meta}>
                  <time>
                    <FiCalendar /> 12/12/12
                  </time>
                  <span>
                    <FiUser />
                    person
                  </span>
                </div>
              </a>
            </Link>
            <Link href="/">
              <a>
                <h2>titulo post</h2>
                <div> post opijf opjf pojm </div>
                <div className={styles.meta}>
                  <time>12/12/12</time>
                  <span>person</span>
                </div>
              </a>
            </Link>
          </div>
        </article>
        <div>carregar mais posts</div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
