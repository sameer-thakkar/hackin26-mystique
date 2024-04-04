import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'UI/Image';
import COLORS from 'const/colors';
import { HALYARD } from 'const/ui-constants';
import ChevronLeft from 'assets/chevronLeft';

const FeedContainer = styled.div`
  display: grid;
  grid-row-gap: 32px;
`;

const Card = styled.div`
  border: 1px solid ${COLORS.GRAY.G6};
  border-radius: 4px;
  display: grid;
  grid-template-columns: 25% auto;
  grid-gap: 12px;
  img {
    max-height: 180px;
    object-fit: cover;
    border-radius: 3px 3px 0 0;
    width: 100%;
  }
  @media (max-width: 768px) {
    grid-template-columns: auto;
  }
`;

const Content = styled.div`
  display: grid;
  grid-row-gap: 12px;
  font-family: ${HALYARD.FONT_STACK};
  line-height: 26px;
  padding: 12px;
  align-content: flex-start;
  div {
    max-height: calc(26px * 3);
    overflow: hidden;
  }
  b {
    font-weight: 500;
  }
  h3 {
    margin: 0;
    max-width: 85%;
  }
  @media (max-width: 768px) {
    padding-top: 0;
    h3 {
      max-width: 100%;
    }
  }
`;

const IconLink = styled.a`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: left;
  grid-column-gap: 4px;
  line-height: 1;
  svg {
    transform: rotate(180deg);
    width: 12px;
    height: 12px;
    path {
      stroke: ${COLORS.TEXT.CANDY_1};
      stroke-width: 3px;
    }
  }
`;

/**
 * Blog Feed allows you to add rich cards linking to [blog.headout.com](https://blog.headout.com), <br>
 * this slice automatically picks up the featured image, first paragraph and title of the post and lays them out in a card
 *
 * ### Non Repeatable Zone
 * **Feed URL:** Enter the FULL **JSON** feed url of the category <br>
 * Examples:
 * <li>[https://blog.headout.com/category/broadway-reviews/feed/json](https://blog.headout.com/category/broadway-reviews/feed/json)</li>
 * <li>[https://blog.headout.com/feed/json](https://blog.headout.com/feed/json)</li>
 *
 * **Count/No of Items**: You can control number of posts being retrieved using this count.
 */

const BlogFeed = ({ feed_url, count = 0, defaultCards = [] }: any) => {
  const [cards, setCards] = useState([...defaultCards]);

  useEffect(() => {
    try {
      const feedURL = new URL(feed_url);
      fetch(`/blog${feedURL.pathname}`)
        .then((res) => res.json())
        .then((jResp) => {
          const findFirstParagraphRegex = /<\s*p[^>]*>([\t\s\S]*?)<\s*\/\s*p>/;
          const itemCount = count || jResp.items.length;
          const parsedItems = jResp?.items.map((item: any) => {
            return {
              title: item.title,
              content: findFirstParagraphRegex
                .exec(item.content_html)?.[1]
                ?.trim(),
              url: item.url,
              image: item.image,
            };
          });
          setCards(parsedItems.slice(0, itemCount));
        });
    } catch (_e) {
      return;
    }
  }, [count, feed_url]);

  return (
    <FeedContainer>
      {cards.map((card, index) => {
        return (
          <Card key={index}>
            <Image url={card.image} alt={card.title} />
            <Content>
              <h3>{card.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: card.content }}></div>
              <IconLink href={card.url} target="_blank" rel="noopener">
                <span>Read More</span>
                {ChevronLeft}
              </IconLink>
            </Content>
          </Card>
        );
      })}
    </FeedContainer>
  );
};

export default BlogFeed;
