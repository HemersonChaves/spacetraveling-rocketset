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
  const posts = postsPagination.results;
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
            {posts.map(post => (
              <Link key={post.data.title} href={`/posts/${post.data.title}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <div>{post.data.subtitle} </div>
                  <div className={styles.meta}>
                    <time>
                      <FiCalendar /> 12/12/12
                    </time>
                    <span>
                      <FiUser />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
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
  };
  return {
    props: { postsPagination },
  };
};
