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

import { Slider } from '@mui/material';


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
  const [currentProfile, setCurrentProfile] = useState('default') // todo get default from profileoptions.defaultprofile
  const [persistentProfile, setPersistentProfile] = useState(null)

  let loadedGlobalStateFromJSONFile = false

  
  // checkSwitchProfile Switches profiles if new application is registered as app.
  //   todo: optimize this; seems a bit to memory intensive/poorly executed.
  const checkSwitchProfile = (newWindowStr) => {
// console.log(profiles)
// console.log(profiles.default)
// console.log(loadedGlobalStateFromJSONFile)

    if(persistentProfile != null) {
      console.log('persistentProfile detected. not switching.')
      return
    }

    if(profiles != null) {console.log(newWindowStr)
      let profileKeys = Object.keys(profiles)
      let profileValues = Object.values(profiles)

      for (let i = 0; i < profileValues.length; i++) {
        const myProfile = profileValues[i];

        // If new window has associated program, use that profile
        if(myProfile.profileOptions?.associatedPrograms.findIndex(
              programStr => (newWindowStr.indexOf(programStr) != -1)
            ) != -1
          ) {
            if(currentProfile != profileKeys[i]) {
              setCurrentProfile(profileKeys[i])
            }
            break
        }

        // In every other case, use default.
        else {
          setCurrentProfile('default')
        }

      }
    }

  }

  useEffect(() => {

    // todo: load in global state from globalstate.json (create)
    //    if legit; set globalState
    // 
      //    let loadedGlobalStateFromJSONFile = true


    // Get the settings.jsonc loaded from electron main application through ipcRenderer.
    // We then load our front-end React UI based on the settings.jsonc configuration.
    window.electron.ipcRenderer.sendMessage('get-settings-json', ['ping']);
    window.electron.ipcRenderer.once('get-settings-json', (profileArg :any) => { // add a one time listener
      console.log(profileArg);
      if(profileArg != null && profileArg.default != null) {
        setProfiles(profileArg)
        // console.log(profileArg)
        // console.log(profiles)
      }
    } , []);


    
  // setInterval(()=>{
  //   console.log(profiles)
  // }, 500)

    return () => {
      // on component unload here
    }
  }, [])

  useEffect(() => {
    
    // todo: working in this useeffect, but todo probably now adding multiplie subscriptions to this on event.. need to remove for every rerender.
    // detect focused window change (then change profile)
    window.electron.ipcRenderer.on('focused-window-change', (newWinStrArg :any) => {
      // console.log(newWinStrArg);
      if(newWinStrArg != null) {
        // let theStringHere = String(newWinStrArg)
        // theStringHere = theStringHere.replace(/\n/, '')
      // console.log(typeof newWinStrArg)
      // console.log(typeof theStringHere)
      // console.log(theStringHere);
      // console.log(newWinStrArg);
      // console.log(theStringHere.length);
      // console.log(profiles)
        checkSwitchProfile(newWinStrArg)
      }
    });

  }, [profiles])


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

{/* <Slider
  sx={{
    '& input[type="range"]': {
      WebkitAppearance: 'slider-vertical',
    },
  }}
  orientation="vertical"
  defaultValue={30}
  aria-label="Temperature"
  valueLabelDisplay="auto"
  classes="testingg"
  // onKeyDown={preventHorizontalKeyboardNavigation}
/> */}

      {
        (profiles != null) ? 
          <ComponentsRenderer system={system} components={profiles[currentProfile].components} />
          :
          null
      }

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
