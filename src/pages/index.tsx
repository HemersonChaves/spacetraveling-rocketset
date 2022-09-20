import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
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
  const postsResponse = postsPagination.results;
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  function formatePosts(postsResults: any): Post[] {
    const posts = postsResults.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));
    return posts;
  }
  const [posts, setPosts] = useState<Post[]>(formatePosts(postsResponse));

  async function handleCarregarMais(): Promise<void> {
    if (nextPage === null) return;

    const novosPostsResponse = await fetch(nextPage).then(response =>
      response.json()
    );
    if (novosPostsResponse) {
      setNextPage(novosPostsResponse.next_page);
    }
    const novosPosts = formatePosts(novosPostsResponse.results);

    setPosts([...posts, ...novosPosts]);
  }
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
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <h2>{post.data.title}</h2>
                  <div>{post.data.subtitle} </div>
                  <div className={styles.meta}>
                    <time>
                      <FiCalendar className={styles.icon} />
                      {post.first_publication_date}
                    </time>
                    <span>
                      <FiUser className={styles.icon} />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </article>
        <div>
          {nextPage && (
            <button
              type="button"
              onClick={() => handleCarregarMais()}
              className={styles.maisButton}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});

  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1,
    orderings: {
      field: 'last_publication_date',
      direction: 'desc',
    },
  });
  const postsPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };
  return {
    props: { postsPagination },
  };
};
