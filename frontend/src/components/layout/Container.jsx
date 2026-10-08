/** Page-width container: 1280px max, fluid gutters. */
const Container = ({ as = 'div', className = '', children, ...rest }) => {
  const Tag = as;
  return (
    <Tag className={`mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-10 ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export default Container;
