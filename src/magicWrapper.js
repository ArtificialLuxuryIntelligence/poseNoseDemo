import React, { useRef, useState, useEffect, forwardRef } from 'react';

export default function magicWrapper(WrappedComponent) {
  function AddRef() {
    const myRef = useRef(null);
    useEffect(() => {
      myRef.current = 1;
      setInterval(() => {
        myRef.current += 1;
      }, 1000);
    }, []);

    let forwardRef = myRef;
    return <WrappedComponent thing={myRef} ball={33} />;
  }

  return AddRef;
}
