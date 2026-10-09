/**
 * Inline-SVG line-icon set (24px grid, 2px stroke, currentColor). One
 * consistent family instead of emoji — add icons here as pages need them.
 * A value is one path or an array of paths.
 */
const PATHS = {
  'arrow-right': 'M5 12h14m0 0-6-6m6 6-6 6',
  'arrow-left': 'M19 12H5m0 0 6 6m-6-6 6-6',
  'chevron-left': 'm15 18-6-6 6-6',
  'chevron-right': 'm9 18 6-6-6-6',
  'chevron-down': 'm6 9 6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  external: 'M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  calendar: ['M8 3v4M16 3v4', 'M4 9h16', 'M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z'],
  clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
  pin: ['M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z', 'M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  users: [
    'M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20',
    'M10 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
    'M20 20v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.6a3.5 3.5 0 0 1 0 6.8',
  ],
  photo: ['M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z', 'm4 16 4.5-4.5a1.5 1.5 0 0 1 2 0L16 17', 'm14 15 1.5-1.5a1.5 1.5 0 0 1 2 0L20 16', 'M15 9h.01'],
  check: 'M5 12.5 10 17l9-10',
  lock: ['M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z', 'M8 11V7.5a4 4 0 0 1 8 0V11'],
  code: 'm8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16',
  palette: [
    'M12 21a9 9 0 1 1 9-9c0 2.2-1.8 3.5-3.6 3.5h-2a1.8 1.8 0 0 0-1.3 3.1A1.5 1.5 0 0 1 12 21z',
    'M7.5 11.5h.01M10 7.5h.01M14.5 7.5h.01M17 11h.01',
  ],
  megaphone: ['M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1z', 'M17 9a4 4 0 0 1 0 6', 'M7 15l1.5 5'],
  video: ['M4 7h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z', 'm16 10.5 5-3v9l-5-3'],
  flag: ['M5 21V4', 'M5 4h11l-2 4 2 4H5'],
  book: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z', 'M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5'],
  hammer: ['m14 7 3-3 4 4-3 3', 'M17 4l-9.5 9.5', 'm4 17 6.5-6.5 3 3L7 20a2.1 2.1 0 0 1-3-3z'],
  sprout: ['M12 21v-9', 'M12 12c0-4 3-6 7-6 0 4-3 6-7 6z', 'M12 15c0-3-2.5-5-6-5 0 3 2.5 5 6 5z'],
  mail: ['M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'm3.5 7 8.5 6 8.5-6'],
  'thumb-up': ['M7 11v9H4v-9h3z', 'M7 11l4-7a2 2 0 0 1 2 2.3L12.4 10H18a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7'],
  'thumb-down': ['M7 13V4H4v9h3z', 'M7 13l4 7a2 2 0 0 0 2-2.3L12.4 14H18a2 2 0 0 0 2-2.3l-1.2-6A2 2 0 0 0 16.8 4H7'],
  send: ['M5 12h14', 'm12 5 7 7-7 7'],
  chat: ['M5 5h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z', 'M8 9.5h8M8 13h5'],
  star: 'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5z',
  plus: 'M12 5v14M5 12h14',
  grid: ['M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'],
  home: ['M4 11 12 4l8 7', 'M6 9.5V20h12V9.5'],
  info: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 11v5M12 8h.01'],
};

const Icon = ({ name, className = 'size-5', ...rest }) => {
  const d = PATHS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {(Array.isArray(d) ? d : [d]).map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
};

export default Icon;
