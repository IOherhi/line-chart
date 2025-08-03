import React from 'react';

export const selectExperiments = (
  exp: string,
  showExp: string[],
  setShowExp: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const haveExp = showExp.find((item) => item === exp);

  if (haveExp) {
    setShowExp(showExp.filter((item) => item !== exp));
    return;
  }

  if (showExp.length >= 2) {
    setShowExp(prev => [...prev.slice(1), exp]);
  } else {
    setShowExp(prev => [...prev, exp]);
  }
}