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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // console.log({ postsPagination });

  return (
    <>
      <Head>
        <title>Space Traveling | Rocketseat</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <img src="/images/logo.svg" alt="space traveling" />
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
        <div>
          <button
            type="button"
            // onClick={() => handleSubscribe()}
            className={styles.maisButton}
          >
            carregar mais posts
          </button>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', { pageSize: 20 });
  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
    //   results: [
    //     {
    //       uid: postsResponse.results[0].id,
    //       first_publication_date: postsResponse.results[0].first_publication_date,
    //       data: {
    //         title: postsResponse.results[0].data.title,
    //         subtitle: postsResponse.results[0].data.subtitle,
    //         author: postsResponse.results[0].data.author,
    //       },
    //     },
    //   ],
  };
  return {
    props: { postsPagination },
  };
};
