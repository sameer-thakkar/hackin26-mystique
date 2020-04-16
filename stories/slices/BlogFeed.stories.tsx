import React from 'react';
import '../../style/global.css';
import BlogFeed from '../../components/slices/BlogFeed';
import { StyledLongForm } from '../../components/common/LongForm';

export default {
  title: 'Slices/Blog Feed',
  component: BlogFeed,
};
const data = {
  feed_url: 'https://blog.headout.com/category/broadway-reviews/feed/json',
  count: 5,
  defaultCards: [
    {
      title: 'Six the Musical Broadway Reviews – The Review Round-Up!',
      content:
        'Six the Musical centers around the six wives of the infamous King Henry VIII. “Divorced, beheaded, died, divorced, beheaded, survived” historically summarize their fate. This Broadway musical attempts to give them a voice where they narrate their stories through music. From Tudor Queens to Pop Princesses, the wives take the mic to battle it out over which who suffered the most at the hands of Henry VIII. It features a stellar star cast; the six wives are played by Adrianna Hicks, Andrea Macasaet, Abby Mueller, Brittney Mack, Samantha Pauly and Anna Uzele.',
      url: 'https://blog.headout.com/six-the-musical-broadway-reviews/',
      image:
        'https://blog.headout.com/wp-content/uploads/2020/02/six-the-musical.jpg',
    },
    {
      title:
        'Who’s Afraid of Virginia Woolf? Broadway Reviews – The Review Round-Up!',
      content:
        "Who’s Afraid of Virginia Woolf? originally premiered on Broadway in 1962, blowing audiences away with its searing portrayal of marriage -- making Edward Albee, the playwright, instantly famous. The story revolves around Martha and George, a middle-aged couple, whose marriage is on the verge of crumbling. One night, Martha invites a younger couple, Nick and Honey, for an after-party, much to the displeasure of George. Little do Nick and Honey know that they're about to be dragged into a toxic feud between the older couple. As the night grows old, the elderly couple's bitterness towards each other spills onto the guests, culminating into catharsis.",
      url:
        'https://blog.headout.com/whos-afraid-of-virginia-woolf-broadway-reviews/',
      image:
        'https://blog.headout.com/wp-content/uploads/2020/02/virginia-woolf.jpeg',
    },
    {
      title:
        'Girl From the North Country Musical Broadway Reviews – The Review Round-Up!',
      content:
        'The Girl from the North Country is a musical inspired by the legendary musician, Bob Dylan. Set in 1934, in Dylan’s hometown of Duluth, Minnesota, the story revolves around the Laine family and their struggles after the Great Depression. Nick Laine, while trying to keep his family from being homeless, also has to deal with an alcoholic son, a wife suffering from dementia and a pregnant daughter who refuses to reveal the identity of her baby’s father. The situation goes further out of control when one stormy night, a bible salesman, a boxer and a couple seek shelter at the Laine guesthouse.',
      url:
        'https://blog.headout.com/girl-from-the-north-country-musical-broadway-reviews/',
      image:
        'https://blog.headout.com/wp-content/uploads/2020/02/girl-from-the-north-country.jpg',
    },
    {
      title: 'Mrs. Doubtfire Musical Broadway Reviews – The Review Round-Up!',
      content:
        'Mrs. Doubtfire is based on the 1993 hit film that saw the beloved late actor Robin Williams play the iconic titular role. Daniel Hillard, a struggling actor, loses custody of his kids after a messy divorce. Desperate to spend time with them, he adopts the persona of an old Scottish woman, Euphegenia Doubtfire, to trick his wife into hiring him as a nanny. While babysitting his children, he learns the true meaning of fatherhood.',
      url: 'https://blog.headout.com/mrs-doubtfire-musical-broadway-reviews/',
      image:
        'https://blog.headout.com/wp-content/uploads/2020/01/Mrs-doubtfire.jpeg',
    },
    {
      title: 'Diana Musical Broadway Reviews – The Review Round-Up!',
      content:
        'Diana the musical explores the whirlwind life of the late Princess and her marriage to Prince Charles. After the end of her rocky marriage, Princess Diana steps out to accomplish her dreams. She was a cultural icon who defied tradition to stand up for herself, her family and her country. Written by Joe DiPietro and David Bryan, and directed by Christopher Ashley, this Broadway production brings the legend of Princess Diana to life. The show features music by Ian Eisendrath and choreography by Kelly Devine. Broadway previews begin from 2 March 2020, with opening night scheduled for 31 March 2020.',
      url: 'https://blog.headout.com/diana-musical-broadway-reviews/',
      image: 'https://blog.headout.com/wp-content/uploads/2019/11/11341.jpg',
    },
  ],
};

export const Basic = () => {
  return (
    <StyledLongForm>
      <div className="slice-wrapper slice-block">
        <BlogFeed {...data} />
      </div>
    </StyledLongForm>
  );
};
