import React from 'react'

import fish from '../../public/fish.json'

const App = () => {
  return (
    <>
      <h1>Animal Crossing</h1>
      {fish.map(({name, image}) => (
        <p>
          <img src={require(`../../public/images/${image.path}`)} />
          {name}
        </p>
      ))}
    </>
  )
}

export default App
