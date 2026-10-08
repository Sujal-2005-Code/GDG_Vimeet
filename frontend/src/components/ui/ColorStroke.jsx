/**
 * The signature motif: Blue → Red → Yellow → Green as one stroke.
 * Decorative (aria-hidden). Use deliberately — active nav indicator, under
 * key headings, dividers, form success, the footer's closing line.
 */
const ColorStroke = ({ className = 'h-[3px] w-24', ...rest }) => (
  <span aria-hidden="true" className={`color-stroke block rounded-full ${className}`} {...rest} />
);

export default ColorStroke;
