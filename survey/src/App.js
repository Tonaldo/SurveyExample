import logo from './logo.png';
import './App.css';
import { ChakraProvider } from "@chakra-ui/react"
import SurveyContainer from "./surveyContainer.js"

function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

      </header>
      <SurveyContainer/>
      
    </div>
    </ChakraProvider>
  );
}

export default App;
