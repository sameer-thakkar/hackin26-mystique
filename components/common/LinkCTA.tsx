import Link from 'next/link';
import {
  Link as EeveeLink,
  type TLinkElementTypes,
  type TLinkProps,
} from '@headout/eevee';

type LinkProps<Tag extends TLinkElementTypes> = Omit<
  TLinkProps<Tag extends 'anchor' ? typeof Link : Tag>,
  'as'
> & {
  isExternalLink?: boolean;
  as: Tag;
};

function LinkCTA<Tag extends TLinkElementTypes>({
  isExternalLink = false,
  as,
  href,
  text,
  ...restProps
}: LinkProps<Tag>) {
  if (isExternalLink) {
    return <EeveeLink as="anchor" href={href} text={text} {...restProps} />;
  }

  if (as === 'div') {
    return <EeveeLink as="div" text={text} {...restProps} />;
  }

  if (as === 'button') {
    return <EeveeLink as="button" text={text} {...restProps} />;
  }

  if (!href) {
    return null;
  }

  const [pathname, query] = href.split('?');
  const queryParams = Object.fromEntries(new URLSearchParams(query || ''));

  return (
    <EeveeLink
      as={Link}
      href={{
        // Separate pathname and query to prevent ? from being encoded as %3F
        pathname,
        query: queryParams,
      }}
      text={text}
      {...restProps}
    />
  );
}

export default LinkCTA;
