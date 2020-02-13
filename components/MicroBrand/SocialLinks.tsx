import { RichText } from 'prismic-reactjs';
import { shortCodeSerializer } from '../../utils/shortCodes';
import Image from '../Image';
import Link from 'next/link';
import { InteractionContext } from '../contexts/Interaction';
import { AVENIR, GRAPHIK, COLORS } from '../../constants/ui-constants';
import { FACEBOOK, TWITTER, INSTAGRAM } from '../../public/static/svg-icons';

const SocialLinks = props => {
  return (
    <div className="social-link-wrapper">
      <div className="social-links">
        <div className="facebook icon">
          <a href="http://www.facebook.com/headoutapp" target="_blank">
            {FACEBOOK}
          </a>
        </div>
        <div className="twitter icon">
          <a href="http://www.twitter.com/headout" target="_blank">
            {TWITTER}
          </a>
        </div>
        <div className="instagram icon">
          <a href="http://www.instagram.com/headoutapp" target="_blank">
            {INSTAGRAM}
          </a>
        </div>
      </div>
      <style jsx>
        {`
          .social-links {
            display: grid;
            grid-template-columns: auto auto auto;
            grid-column-gap: 15px;
          }
          .social-links .icon {
            align-self: center;
          }
          .social-links .icon,
          .social-links .icon a {
            display: flex;
          }
          @media (max-width: 768px) {
            .social-links {
              justify-content: right;
            }
          }
        `}
      </style>
      <style jsx global>
        {`
          .social-link-wrapper .icon svg {
            height: 20px;
            width: 20px;
          }
        `}
      </style>
    </div>
  );
};

export default SocialLinks;
