import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import ColorStroke from '../components/ui/ColorStroke';
import usePageMeta from '../hooks/usePageMeta';

/** Friendly 404 for unknown routes (and unknown event slugs). */
const NotFound = ({ what = 'page' }) => {
  usePageMeta(what === 'event' ? 'Event not found' : 'Page not found');
  return (
    <main id="main" className="bg-surface">
      <Container className="flex min-h-[70svh] flex-col items-start justify-center pb-16 pt-[calc(var(--nav-h)+3rem)]">
        <p className="font-mono text-overline font-medium uppercase text-ink-2">Error 404</p>
        <h1 className="mt-3 text-h1 text-ink">
          {what === 'event' ? 'We couldn’t find that event' : 'This page doesn’t exist'}
        </h1>
        <ColorStroke className="mt-5 h-[3px] w-20" />
        <p className="mt-5 max-w-[52ch] text-body-lg text-ink-2">
          {what === 'event'
            ? 'It may have been renamed. Every event and gallery is listed on the events page.'
            : 'The link may be broken or the page may have moved.'}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to={what === 'event' ? '/events' : '/'} icon="arrow-right">
            {what === 'event' ? 'All events' : 'Back to home'}
          </Button>
        </div>
      </Container>
    </main>
  );
};

export default NotFound;
