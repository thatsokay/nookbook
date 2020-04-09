import React from 'react'

import fish from '../../assets/fish.json'

const App = () => {
  return (
    <>
      <h1>Animal Crossing</h1>
      {fish.map(({name, image}) => (
        <p>
          <img src={require(`../../assets/${image.path}`)} />
          {name}
        </p>
      ))}
    </>
  )
}

export default App
