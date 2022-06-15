import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState,
  useEffect,
} from 'react';
import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Button } from '@mui/material';
// import styled from 'styled-components'

import Tap from './components/Tap/Tap'
import ComponentsRenderer from './components/ComponentsRenderer'
import Util from './Util'



var appGlobalState: any = null

// save globalstate to external (to application) JSON file. (ON same computer as this app/exe)
// const saveGlobalState = () => {
//   // globalState
//   // JSON.stringify
// }

// const dynamicComponents: object = {
//   'Tap': Tap,
// }

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

  const [profiles, setProfiles] = useState(null)
  const [currentProfile, setCurrentProfile] = useState('default')

  let loadedGlobalStateFromJSONFile = false

  useEffect(() => {

    // todo: load in global state from globalstate.json (create)
    //    if legit; set globalState
    // 
      //    let loadedGlobalStateFromJSONFile = true


    // Get the settings.jsonc loaded from electron main application through ipcRenderer.
    // We then load our front-end React UI based on the settings.jsonc configuration.
    window.electron.ipcRenderer.sendMessage('get-settings-json', ['ping']);
    window.electron.ipcRenderer.once('get-settings-json', (arg :any) => { // add a one time listener
      // console.log(arg);
      if(arg != null && arg.default != null) {
        setProfiles(arg)
      }
    });

    return () => {
      // on component unload here
    }
  }, [])

  const system: any = {
    loadedGlobalStateFromJSONFile: loadedGlobalStateFromJSONFile,
    
    appGlobalState: appGlobalState,

  // systemCommand handles all system commands. This function will handle the big work.
    command: (command: string, options = null) => {

      // Send key/key combo to currently hovered app
      // if(command.indexOf("SYSTEM_NET_SEND_KEYS") != -1) {  // send across net
      if(command.indexOf("SYSTEM_SEND_KEYS") != -1) {

        let keysToSend = command.split('SYSTEM_SEND_KEYS ')[1].split(' ')

        let sendKeyBatchProgramParamStr = Util.getSendKeyBatchStr(keysToSend)  

        // window.electron.ipcRenderer.sendMessage('system-send-key', {
        //   command: sendKeyBatchProgramParamStr,
        //   callback: (stdout) => {}
        // })
        window.electron.ipcRenderer.sendMessage(
          'system-send-key', 
          sendKeyBatchProgramParamStr,
          // (stdout) => {}
        )


        // let childComponentId = commandParams[0]
        // let componentProp = commandParams[1]
        // let newValue = commandParams[2]

        // let firstCommandParam = 
        console.log(sendKeyBatchProgramParamStr)
      }
      else if(command.indexOf("SYSTEM_NETWORK_SEND_KEYS") != -1) {
        let keysToSend = command.split('SYSTEM_NETWORK_SEND_KEYS ')[1].split(' ')
        let sendKeyBatchProgramParamStr = Util.getSendKeyBatchStr(keysToSend)  

        window.electron.ipcRenderer.sendMessage(
          'system-net-send-key', 
          sendKeyBatchProgramParamStr,
        )

        // console.log(sendKeyBatchProgramParamStr)
      }
      else {
        // this.sendMessage(`Unknown command: ${command}`) // compiler angry: this.sendmessage undefined
        console.log(`Unknown command: ${command}`)
      }
    },
    
  // Displays a nice looking message using material UI
  // todo: warnings, errors, normal, succes, etc.
    sendMessage: (msg: string, msgType: string) => {
      console.log(msg)
    },
    updateGlobalState: (componentId: string, state: object) => {
      appGlobalState[componentId] = state
    },
  }

  return (
    // <div style={{background: 'black'}}>
    <div className="app-container" style={{width: '100vw', height: '100vh', }}>

      
      {
        (profiles != null) ? 
          <ComponentsRenderer system={system} components={profiles[currentProfile].components} />
          :
          null
      }

      {/* {
        (profiles != null) ? 
          profiles[currentProfile].components.map((component: object, index: number) => {

            if(component != null) {

              // store global state for saving if not loaded from globalstate.json
              if(loadedGlobalStateFromJSONFile == false) {
                if(component.props != null && component.state != null && component.componentId != null) {
                  appGlobalState[component.componentId] = component.props.state
                }
              }

              if(component.componentId == 'some unique component') {
              }
              else {
                let DynamicComponent: object = dynamicComponents[component.componentId]
                return (
                  <DynamicComponent {...component.props} 
                    key={component.componentId + '--' + index} 
                    componentId={index} 
                    system={system} 
                    />
                )
              }
            }

          })
          :
          null
      } */}

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
