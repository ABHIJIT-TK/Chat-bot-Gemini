// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [error, setError] = useState("");
//   const [value, setValue] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);

//   const getResponse = async () => {
//     if (!value) {
//       setError('Ask something!');
//       return;
//     }

//     try {
//       const options = {
//         method: 'POST',
//         body: JSON.stringify({
//           history: chatHistory,
//           message: value
//         }),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       };

//       const response = await fetch('http://localhost:8000/gemini', options);
//       const data = await response.text();

//       setChatHistory(old => [
//         ...old,
//         { role: 'user ', parts: value },
//         { role: 'model ', parts: data }
//       ]);

//       setValue('');
//     } catch (error) {
//       console.error(error);
//       setError('Something went wrong');
//     }
//   };

//   const clear = () => {
//     setChatHistory([]);
//     setValue("");
//     setError("");
//   };

//   return (
//     <div className="App">
//         <p>Quest</p>
//         <div className='input-container'>
//           <input
//             value={value}
//             placeholder='Type your question here...'
//             onChange={(e) => setValue(e.target.value)}
//           />
//           {!error && <button onClick={getResponse} >Ask me</button>}
//           {error && <button onClick={clear}>Clear</button>}
//         </div>
//         {error && <p>{error}</p>}
//         <div className='search'>
//           {chatHistory.map((chatItem, index) => (
//             <div key={index}>
//               <p className='answer'>{chatItem.role}: {chatItem.parts}</p>
//             <br/>
//             </div>
            
//           ))}
//         </div>
//     </div>
//   );
// }

// export default App;


import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = 'http://localhost:8000/gemini'; // Define base URL outside component

function App() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const fetchData = async () => {
    if (!userInput) {
      setErrorMessage('Ask something!');
      return;
    }

    setErrorMessage(''); // Clear error on successful input
    setIsLoading(true);

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: userInput
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(BASE_URL, options);
      const data = await response.text();

      setChatHistory((prevHistory) => [
        ...prevHistory,
        { role: 'user', parts: userInput },
        { role: 'model', parts: data }
      ]);

      setUserInput('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong');
    } finally {
      setIsLoading(false); // Always clear loading state
    }
  };

  const handleClear = () => {
    setChatHistory([]);
    setUserInput('');
    setErrorMessage('');
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Conditional rendering based on loading state (optional)
  const renderAskButton = () => (
    !errorMessage && !isLoading && <button onClick={fetchData}>Ask me</button>
  );

  const renderClearButton = () => (
    // Can optimize to only render if chatHistory exists (optional)
    <button onClick={handleClear}>Clear</button>
  );

  const renderChatMessageHistory = () => (
    <div className='search'>
      {chatHistory.map((chatItem, index) => (
        <div key={index}>
          <p className='answer'>{chatItem.role}: {chatItem.parts}</p>
          <br />
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      <p>Quest</p>
      <div className='input-container'>
        <input
          value={userInput}
          placeholder='Type your question here...'
          onChange={handleInputChange}
        />
        {renderAskButton()}
        {errorMessage && <button onClick={handleClear}>Clear</button>} {/* Or conditionally render based on error state */}
      </div>
      {errorMessage && <p>{errorMessage}</p>}
      {isLoading ? (
        <p>Loading...</p> // Optional loading indicator while fetching data
      ) : (
        renderChatMessageHistory()
      )}
    </div>
  );
}

export default App;
