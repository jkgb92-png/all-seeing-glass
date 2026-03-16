import React from 'react';

const DicyaninFilter = ({ children }) => {
  const filterStyle = {
    WebkitFilter: 'hue-rotate(180deg) saturate(150%) brightness(90%)',
    filter: 'hue-rotate(180deg) saturate(150%) brightness(90%)',
  };

  return <div style={filterStyle}>{children}</div>;
};

export default DicyaninFilter;