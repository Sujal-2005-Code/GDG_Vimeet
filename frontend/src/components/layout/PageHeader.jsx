import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import SectionHeader from '../ui/SectionHeader';
import Container from './Container';

/**
 * Top of every inner page: breadcrumbs + the page's h1 (overline, heading,
 * stroke, lede). `crumbs` are [{ label, to }]; the current page is appended.
 */
const PageHeader = ({ crumbs = [], current, overline, title, lede, children }) => (
  <header className="bg-surface pb-12 pt-[calc(var(--nav-h)+2rem)] sm:pb-16 sm:pt-[calc(var(--nav-h)+3rem)]">
    <Container>
      <nav aria-label="Breadcrumb" data-reveal>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-2">
          {[{ label: 'Home', to: '/' }, ...crumbs].map((c) => (
            <li key={c.to} className="inline-flex items-center gap-1">
              <Link to={c.to} className="inline-flex min-h-11 items-center rounded-field px-1 hover:text-ink hover:underline">
                {c.label}
              </Link>
              <Icon name="chevron-right" className="size-4 text-line-strong" />
            </li>
          ))}
          <li aria-current="page" className="px-1 font-medium text-ink">
            {current}
          </li>
        </ol>
      </nav>
      <SectionHeader as="h1" size="h1" overline={overline} title={title} lede={lede} className="mt-6 max-w-[52rem]">
        {children}
      </SectionHeader>
    </Container>
  </header>
);

export default PageHeader;
