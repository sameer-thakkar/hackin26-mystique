import { sva } from '@headout/pixie/css';

export const getUnavailableTicketStylesRecipe = sva({
  slots: [
    'TicketsUnavailableSection',
    'TicketsUnavailableHeaderDweb',
    'TicketsUnavailableHeaderMweb',
    'TicketsUnavailableTextWrapper',
    'SvgWrapper',
    'AlternativeShowRecommendationSection',
    'TicketsUnavailableText',
    'TicketsUnavailableSubText',
    'MustSeeHeading',
    'MoreShowsButtonWrapper',
    'TicketsUnavailableMwebContainer',
    'TicketsUnavailableHeaderCommon',
    'ticketUnavailableDummyCard',
    'ticketUnavailableDummyText',
    'ticketUnavailableDummyHeading',
    'ticketUnavailableDummyPrice',
  ],
  base: {
    TicketsUnavailableSection: {
      overflow: 'scroll',
      backgroundColor: 'semantic.surface.light.white',
      border: '1px solid COLORS.GRAY.G7',
      borderRadius: '1rem',
      alignItems: 'center',
      scrollbarWidth: 'none',

      '@media (max-width: 768px)': {
        borderRadius: 0,
        paddingBottom: '1.5rem',
        position: 'relative',
        maxHeight: '50vh',
      },
    },
    TicketsUnavailableMwebContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.16',
    },
    TicketsUnavailableHeaderDweb: {
      padding: '1.5rem',
      borderBottom: 'token(spacing.space.1) solid',
      borderColor: 'core.grey.300',
      backgroundColor: '#f5f5f5',
    },
    TicketsUnavailableHeaderMweb: {
      backgroundColor: 'semantic.surface.light.white',
    },
    TicketsUnavailableHeaderCommon: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'space.8',
      alignSelf: 'stretch',
    },
    SvgWrapper: {
      marginTop: 'space.2',
    },
    TicketsUnavailableTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.4',
    },
    AlternativeShowRecommendationSection: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: 'semantic.surface.light.white',
    },
    TicketsUnavailableText: {
      textStyle: 'subheading.large',
      color: 'semantic.text.grey.3',
    },
    TicketsUnavailableSubText: {
      textStyle: 'ui.label.regular',
      color: 'semantic.text.grey.3',
    },
    MustSeeHeading: {
      textStyle: 'heading.medium',
      color: 'semantic.text.grey.2',
    },
    MoreShowsButtonWrapper: {
      display: 'flex',
    },
    ticketUnavailableDummyCard: {
      display: 'flex',
      gap: 'space.12',
    },
    ticketUnavailableDummyText: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'space.8',
    },
    ticketUnavailableDummyHeading: {
      height: '4rem',
      width: '12rem',
      backgroundColor: 'core.grey.300',
      borderRadius: 'token(spacing.space.4)',
    },
    ticketUnavailableDummyPrice: {
      height: '2rem',
      width: '4rem',
      backgroundColor: 'core.grey.300',
      borderRadius: 'token(spacing.space.4)',
    },
  },
});
