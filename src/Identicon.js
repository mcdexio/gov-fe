import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import jdenticon from 'jdenticon/standalone';

const Identicon = ({ value = 'test', size = '100%', className }) => {
  const icon = useRef(null);
  useEffect(() => {
    jdenticon.update(icon.current, value);
  }, [value]);

  return (
    <div className={className}>
      <svg data-jdenticon-value={value} height={size} ref={icon} width={size} />
    </div>
  );
};

Identicon.propTypes = {
  size: PropTypes.string,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};
export default Identicon;
