import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const date = format(new Date(post.first_publication_date), 'd MMM yyyy', {
    locale: ptBR,
  });
  const tempoEstimado = Math.ceil(
    post.data.content.reduce(
      (acc, contentItem) =>
        acc +
        contentItem.heading.toString().split(' ').length +
        contentItem.body.reduce(
          (acc2, bodyItem) => acc2 + bodyItem.text.toString().split(' ').length,
          0
        ),
      0
    ) / 200
  );

  console.log(`total ${tempoEstimado}`);
  const router = useRouter();
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }
  return (
    <>
      <Head>
        <title>{post.data.title} | Ignews</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <span>{post.data.author} </span>
          <span>{`${tempoEstimado} min`} </span>
          <time>{date}</time>
          <div className={styles.postContent}>
            {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div className={styles.postContentParagraphs}>
                  <div
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: String(content.body) }}
                  />
                  <div>{RichText.asText(content.body)}</div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    pageSize: 2,
  });
  let paths = [];
  if (posts.results) {
    paths = posts.results.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    });
  }
  return {
    paths, // indicates that no page needs be created at build time
    fallback: true, // indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug));

  const post: Post = {
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(teste => {
        return {
          heading: teste.heading,
          body: teste.body,
        };
      }),
    },
  };
  return {
    props: {
      post: response,
    },
  };
};
