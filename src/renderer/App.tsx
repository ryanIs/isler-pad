import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Button } from '@mui/material';
// import settingsJSON from './test.jsonc' assert { type: `json` };
// import settingsJSON from './test.jsonc';
var asettingsJSON = require('./test.txt')
// var fs = require('fs');
// import fs from 'fs';
// var obj = JSON.parse(fs.readFileSync('test.jsonc', 'utf8'));
// import { jsonc } from 'jsonc';
console.log(asettingsJSON)
console.log(asettingsJSON)
console.log(asettingsJSON)
let settingsJSON: any = `
{
  "default": {
    "defaultProfile": true,
    "associatedPrograms": [],
    "components": [
      {
        "id": "copy-tap",
        "componentId": "Tap",
        "name": "component name",
        "z-index": 0,
        "props": {
          "width": "50px",
          "height": "50px",
          "left": "100px",
          "top": "100px",
          "innerHTML": "Tap me!",
          "CSSThemeOveride": "blue",
          "options": {
            "tapWaitIntervalMS": 300
          },
          "CSS": {
            "button": {}
          },
          "taps": [
            {
              "onTouchEnd": {
                "default": "SYSTEM_SEND_KEYS LEFT_CONTROL C",
                "control": "",
                "control alt": "",
                "alt": ""
              },
              "onTouchHeld": {
                "default": "SYSTEM_ATTACH_COMPONENT_TO_ME default-Window",
                "default-Window": {
                  "id": "left-control-copy-window",
                  "componentId": "Window",
                  "name": "left control highlight window",
                  "props": {
                    "z-index": 1000,
                    "left": "0",
                    "top": "0",
                    "width": "100px",
                    "height": "100px",
                    "CSSThemeOveride": "default",
                    "CSS": {},
                    "components": [
                      {
                        "id": "paste-tap",
                        "componentId": "Tap",
                        "name": "component name 22",
                        "props": {
                          
                          "innerHTML": "Tap me 222!",
                          "left": "50",
                          "top": "50",
                          "CSSThemeOveride": "red",
                          "onTouchEnd": {
                            "default": "SYSTEM_SEND_KEYS LEFT_CONTROL P"
                          },
                          "onAfterAnyTouchProcedure": "SYSTEM_REMOVE_MY_PARENT" 
                        }
                      },

                      {
                        "id": "all-tap",
                        "componentId": "Tap",
                        "name": "component name bbb",
                        "props": {
                          
                          "innerHTML": "Tap me 333!",
                          "left": "70",
                          "top": "70",
                          "CSSThemeOveride": "green",
                          "onTouchEnd": {
                            "default": "SYSTEM_SEND_KEYS LEFT_CONTROL A"
                          },
                          "onAfterAnyTouchProcedure": "SYSTEM_REMOVE_MY_PARENT" 
                        }
                      }
                    ]
                  }
                }
              },
              "onTouchHeldOutside": {
                "default": "SYSTEM_GET_FUNCTION SYSTEM_CONST_SAME_OBJECT onTouchHeld"
              }
            }
          ]
        }
      }
    ]
  },
  
  "vscode": {}
}
`



const darkTheme = createTheme({
  palette: {
    mode: 'light',
    // mode: 'dark',
  },
})

/**
 * Default View is the main view that the react router loads.
 * 
 * @returns React component.
 */
const DefaultView = () => {

  settingsJSON = JSON.parse(settingsJSON)

  // console.log(settingsJSON)

  return (
    // <div style={{background: 'black'}}>
    <div>



    </div>
        // {/* <Button variant="outlined">Hello</Button> */}
  );
};

// const DefaultView = () => {
//   return (
//     <div>
      
//       <div className="Hello">
//         <img width="200px" alt="icon" src={icon} />
//       </div>
//       <h1>electron-react-boilerplate</h1>
//       <div className="Hello">
//         <a
//           href="https://electron-react-boilerplate.js.org/"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               📚
//             </span>
//             Read our docs
//           </button>
//         </a>
//         <a
//           href="https://github.com/sponsors/electron-react-boilerplate"
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button type="button">
//             <span role="img" aria-label="books">
//               🙏
//             </span>
//             Donate
//           </button>
//         </a>
//       </div>
      
//     </div>
//   );
// };

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DefaultView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
