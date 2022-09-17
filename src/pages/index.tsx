import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
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
                <h1>titulo post</h1>
                <div> post opijf opjf pojm </div>
                <div>
                  <time>12/12/12</time>
                  <span>person</span>
                </div>

              </a>
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
