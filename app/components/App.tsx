import React from "react";

import fish from "../../public/fish.json";

const App = () => {
  console.log(fish.length);
  return (
    <>
      <h1>Animal Crossing</h1>
      {fish.map(({ name }) => (
        <p>{name}</p>
      ))}
    </>
  );
};

export default App;
