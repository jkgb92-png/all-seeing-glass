import React from 'react';

// CSS approximation of the authentic dicyanin spectral filter:
//   • sepia(40%)       – desaturate mid-tones, reduce green/yellow dominance
//   • saturate(350%)   – intensify the surviving blue/red channels
//   • hue-rotate(210deg) – shift warm residuals into the blue-violet range
//   • brightness(70%)  – darken (dicyanin cuts most of the visible spectrum)
//   • contrast(150%)   – enhance edge contrast (Kilner screen characteristic)
const DicyaninFilter = ({ children }) => {
  const filterStyle = {
    WebkitFilter: 'sepia(40%) saturate(350%) hue-rotate(210deg) brightness(70%) contrast(150%)',
    filter: 'sepia(40%) saturate(350%) hue-rotate(210deg) brightness(70%) contrast(150%)',
  };

  return <div style={filterStyle}>{children}</div>;
};

export default DicyaninFilter;