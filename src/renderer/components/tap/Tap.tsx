import { useState, 
  useEffect,
  useRef,
} from 'react';
import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { styled,
  ThemeProvider, createTheme,


} from '@mui/material/styles';
import './Tap.css';
// import { Button } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ComponentsRenderer from '../ComponentsRenderer'
import Util from '../../Util'
// import Util from '../ISlider/ISlider'
import { Slider } from '@mui/material';

import YouDraw from '../YouDraw/YouDraw'


// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import { MuiThemeProvider } from 'material-ui';

const dynamicComponentsArray: object = {
  'YouDraw': YouDraw,
  // 'DynamicWindow': DynamicWindow,
  // 'ISlider': ISlider,
}

const ColorButton = styled(Button)<ButtonProps>(({ theme, UIState }) => ({
  color: theme.palette.getContrastText(Util.getMUIColorObject(UIState?.color)[UIState?.colorDefault || 500]),
  backgroundColor: Util.getMUIColorObject(UIState?.color)[UIState?.colorDefault || 500],
  '&:hover': {
    backgroundColor: Util.getMUIColorObject(UIState?.color)[UIState?.colorHover || 700],
  },
  width: '100%',
  height: '100%',
  overflowWrap: 'break-word',
  wrap: 'break-word',
}));

let taps: number = -1
let tapTimeout = null
let tapDown: Boolean = false
// (if available) touch end command that may be ran (not on SELF component, but on CASTER, which is usually self) that can do clean-up (e.g. close hover menu side, etc.)
let casterOnTouchEndCommand: any = null
let casterOnTouchStartCommand: any = null

// systemMacros stored by first macro command string name.
// Can be used to stop a running macro (get by EXACT first command string match)
let systemMacros = {}

/**
 * Default View is the main view that the react router loads.
 * 
 * @returns React component.
 */
const Tap = (props: any) => {
  // console.log(props)

  // UIState handles the appearence of the dynamic component.
  //   e.g. coloring buttons for Tap; slider coloring/styling etc.
  const [UIState, setUIState] = useState(props.UIState || {})
// console.log(props.UIState)
  
  const interactStartHandler = (interactionType: string = 'touch', ...args) => {
    
    // touchEvent.preventDefault()
    
        // tapWaithInterval // todo: if -1, do not allow any additional taps
    // "onTouchStart": {}, // todo (e.g. press to hold sending repeating key, release to stop)


    ++taps

    removeTapTimeout()
    tapTimeout = setTimeout(() => {tapAction(taps, 'timeout')}, props?.options?.defaultTapWaitIntervalMS || 400); // todo: this options? question mark syntax helps mitigate JSON missings that CAN be defaults; but shouldn't always for required ones - then should crash rightlyso (with error message)

    tapDown = true

    
    if(casterOnTouchStartCommand != null) {
      runSelfEvent(casterOnTouchStartCommand)
      casterOnTouchStartCommand = null
    }

  }

  const interactEndHandler = (interactionType: string = 'touch', ...args) => {
    //     console.log(
    //   document.elementFromPoint(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY)
    // )

    // todo: changedTouches[x] for multiple touches
    // console.log(args[0])
    // Run command if released on an external component with onTouchEnd available.
    let newEle
    if(interactionType == 'mouse') {
      newEle = document.elementFromPoint(args[0].clientX, args[0].clientY)
    }
    else {
      newEle = document.elementFromPoint(args[0].changedTouches[0].clientX, args[0].changedTouches[0].clientY)
    }
    let externalTouchEndCommand = newEle?.getAttribute('systemontouchend')

    if(newEle != null && externalTouchEndCommand != null && myButtonDOMRef.current != newEle) {
      externalTouchEndCommand = JSON.parse(externalTouchEndCommand)
      runSelfEvent(externalTouchEndCommand)
    }

    // console.log(newEle?.getAttribute('systemontouchend'))
    // console.log(myButtonDOMRef)
    // console.log(myButtonDOMRef.current == newEle) // returns true if released on same element

    // console.log(touchEvent)

    // if(taps == 0) {
      // tapAction(taps, 'onTouchEnd')
    // }
    // removeTapTimeout()
    tapDown = false

    if(casterOnTouchEndCommand != null) {
      runSelfEvent(casterOnTouchEndCommand)
      casterOnTouchEndCommand = null
      // console.log(55)
    }
    // get element released on (CANT HAVE ANY WEIRD ELEMENTS ABOVE THIS ONE!! (z-index important))
    
    // console.log(
    //   document.elementFromPoint(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY)
    // )

    // let newEle = document.elementFromPoint(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY)
    
    // // let myEventToDispatch: Event = new Event(`${newEle?.getAttribute('componentid')} ${newEle?.getAttribute('systemontouchend')}`)
    // let myEventToDispatch: Event = new CustomEvent(newEle?.getAttribute('componentid'), {'detail': {value: `${newEle?.getAttribute('systemontouchend')}`} } )

    // window.dispatchEvent(myEventToDispatch)
    // console.log(newEle?.getAttribute('systemontouchend'))
  }

  const myButtonDOMRef = useRef(null)
  

  const mouseEndHandler = (mouseEvent: any) => {
    interactEndHandler('mouse', mouseEvent)
    window.removeEventListener("mouseup", mouseEndHandler, false)
  }

  const mouseStartHandler = (mouseEvent: any) => {
    interactStartHandler('mouse', mouseEvent)
    window.addEventListener("mouseup", mouseEndHandler, false) // Use mouseup to be exactly like how touchEnd functions (pinged from same element as down)
  }

  const touchStartHandler = (touchEvent: any) => {
    interactStartHandler('touch', touchEvent)
  }


  const touchEndHandler = (touchEvent: any) => {
    touchEvent.preventDefault()

    interactEndHandler('touch', touchEvent)
  }

  const dynamicWindowComponent = () => {
    return (
      null
    )
  }

  const tapComponent = () => {
    return (
      <ColorButton 
          onTouchStart={touchStartHandler} 
          onTouchEnd={touchEndHandler} 
          onMouseDown={mouseStartHandler}
          // onMouseUp={mouseEndHandler}
          UIState={UIState}
          propsid={props.id}
          systemontouchend={(props.onTouchEnd == null ? null : JSON.stringify(props.onTouchEnd.default))}
          ref={myButtonDOMRef}
        >
        {/* https://stackoverflow.com/questions/4165836/javascript-scale-text-to-fit-in-fixed-div */}
        {/* <span dangerouslySetInnerHTML={{__html: name}}> </span> */}
        {mainState?.name}
      </ColorButton>
    )
  }

  const sliderChangeHandler = (changeEvent) => {
    setMainState({value: changeEvent.target.value})
  }

  const iSliderComponent = () => { 
    // console.log(Util.getMUIColorObject(UIState?.color)[UIState?.colorDefault || 500])
    // const muiTheme = getMuiTheme({
    //   slider: {
    //     trackColor: Util.getMUIColorObject(UIState?.color)[UIState?.colorTrack || 500],
    //     selectionColor: Util.getMUIColorObject(UIState?.color)[UIState?.colorDefault || 500]
    //   }
    // });

    // const mySliderTheme = createTheme({
    //   components: {
    //     MuiSlider: {
    //       styleOverrides: {
    //         // valueLabel: ({ ownerState, theme }) => ({
    //         //   ...(ownerState.orientation === 'vertical' && {
    //         //     backgroundColor: 'transparent',
    //         //     color: theme.palette.grey[500],
    //         //   }),
    //         // }),
    //       },
    //     },
    //   },
    // });
    if(UIState != null) {
    return (
      // <ColorButton 
      //     onTouchStart={touchStartHandler} 
      //     onTouchEnd={touchEndHandler} 
      //     onMouseDown={mouseStartHandler}
      //     // onMouseUp={mouseEndHandler}
      //     myUIState={props.myUIState}
      //     propsid={props.id}
      //     systemontouchend={(props.onTouchEnd == null ? null : JSON.stringify(props.onTouchEnd.default))}
      //     ref={myButtonDOMRef}
      //   >
      //   {/* https://stackoverflow.com/questions/4165836/javascript-scale-text-to-fit-in-fixed-div */}
      //   {/* <span dangerouslySetInnerHTML={{__html: name}}> </span> */}
      //   {name}
      // </ColorButton>
      // <ThemeProvider theme={mySliderTheme}>
      // <span style={{position: 'relative', height: '100%', width: '100%', }}>
      //   <div style={{position: 'absolute', bottom: '10px', left: '30%', zIndex: 10, }}>
      //     {name}
      //   </div>
        <Slider
          sx={{
            '& input[type="range"]': {
              WebkitAppearance: 'slider-vertical',
            },
          }}
          orientation="vertical"
          defaultValue={mainState?.value}
          // onChange={sliderChangeHandler} // this seems to cause the component to DISAPPEAR!! lol
          // defaultValue={mainState?.value || 50}
          // color={Util.getMUIColorObject(UIState?.color)[UIState?.colorDefault || 500]}
          // aria-label="Temperature" 
          // valueLabelDisplay={UIState.valueLabelDisplay}
          valueLabelDisplay="auto"
          // classes="testingg"
          // onKeyDown={preventHorizontalKeyboardNavigation}
        /> 
        
        // </span>
      // </ThemeProvider>
    )
    } 
    return (
      null
    )

  }

  const getMainComponent = (inputJSComponentId) => {
    if(inputJSComponentId == null) {
      return (null)
    }

    const tapComponentsObject = {
      'Tap': tapComponent,
      'DynamicWindow': dynamicWindowComponent,
      'ISlider': iSliderComponent,
    }
    return tapComponentsObject[inputJSComponentId]()
  }

  // state contains saved variables/settings/parameters for this component.
  //   e.g. text stored in a component/radio buttons/boolean on/off switch/MIDI slider x of 128.
  //   this stuff gets saved to a JSON file (in same folder/computer as application)
  const [mainState, setMainState] = useState(props.mainState || {})
  // const [mainState, setMainState] = useState()
  // console.log("INIT MAIN STATE: " + mainState?.componentEnabled)
  // console.log("mainState: " + mainState?.componentEnabled)

  // todo: setup defaulter func to pass through to get those || defaults
  const [tapContainerStyle, setTapContainerStyle] = useState( Util.containerCSSDefaultsHandler(props.containerCSS, props.JSComponentId) )
  const [mainComponent, setMainComponent] = useState(getMainComponent(props.JSComponentId))
  const [dynamicComponent, setDynamicComponent] = useState(props.dynamicComponentId || null)

  // console.log(props)
  // console.log(tapContainerStyle)

  // const forceUpdate = useForceUpdate()

  // name is the label text displayed on the prop.
  const [myComponents, setMyComponents] = useState(props.components || [])

  // When mainState updates.
  // React and window events are kind of sketchy.
  //    https://stackoverflow.com/questions/60540985/react-usestate-doesnt-update-in-window-events
  useEffect(() => {
    window.addEventListener(props.id, componentEventHandler)
    // setMainState(props.mainState || {})
    // setMainState(props.mainState)
    
    return () => {
      window.removeEventListener(props.id, componentEventHandler)
    }
  }, [mainState])
  
  // Update main state when props changes
  useEffect(() => {
    setMainState(props.mainState)
  }, [props.mainState])
  
  /**
   * Performs a function on this component or it's child components.
   * 
   * @param command {string} The command.
   */
  const systemSelfCommand = (command: string) => {

    
    // we could also change component props (but that's not very smart, but we could)

    // system set component main state
    if(command.indexOf("SYSTEM_SELF_SET_COMPONENT_MAIN_STATE") != -1) {
      let commandParams = command.split('SYSTEM_SELF_SET_COMPONENT_MAIN_STATE ')[1].split(' ')
      let childComponentId = commandParams[0]
      let componentProp = commandParams[1]
      let newValueParam = commandParams[2]
      // todo: handle newValueParam == toggle to toggle [a boolean]
      
      let newValue: any = newValueParam

      // Handle 'SYSTEM_TOGGLE' or some other variant
      const getParsedNewValue = (_myNewVal, _theOldStateValue) => {
        // console.log("_myNewVal: " + _myNewVal)
        // console.log(_theOldStateValue)
        if(newValueParam == 'SYSTEM_TOGGLE') {
          // let oldValueAsBoolean = (_theOldStateValue === true || _theOldStateValue === 'true')
          let oldValueAsBoolean

          if(typeof _theOldStateValue == 'string') {
            oldValueAsBoolean = (_theOldStateValue === 'true')
          } else if(typeof _theOldStateValue == 'number') {
            oldValueAsBoolean = Boolean(_theOldStateValue)
          } else if(typeof _theOldStateValue == 'boolean') {
            oldValueAsBoolean = _theOldStateValue
          } else {
            oldValueAsBoolean = Boolean(_theOldStateValue)
            console.log('WARNING: getparsedValue defaulted to type boolean')
          }

          // console.log(oldValueAsBoolean)
          if(oldValueAsBoolean == true) {
            return false
          }
          else {
            return true
          }
        }

        return _myNewVal

      }
      // console.log(childComponentId)
      // console.log(props.id)
      // Set prop of a child component
      if(childComponentId != props.id) {
        // Update component property
        let targetComponentIndex = Util.getComponentById(myComponents, childComponentId)
        let newComponentsArray = JSON.parse(JSON.stringify(myComponents))
        // newComponentsArray[targetComponentIndex].mainState[componentProp] = newValueParam

        // objective: type check! this assumes it's a variable
        // objective: what about toggling 1 to 0 or 'on' 'off'
        newValue = getParsedNewValue( newValueParam, newComponentsArray[targetComponentIndex].props.mainState[componentProp])
        
        newComponentsArray[targetComponentIndex].props.mainState[componentProp] = Util.getvarBEnsureSameType(
          newComponentsArray[targetComponentIndex].props.mainState[componentProp],
          newValue
        )
        
        setMyComponents(newComponentsArray)
        // todo: set x, y, and width height if needed
        
        // set casterOnTouchEndCommand if available
        if(tapDown && newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd != null) {
          casterOnTouchEndCommand = newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd
          // console.log(casterOnTouchEndCommand)
          // console.log(tapDown)
        }
      }

      // Set prop of this component  
      else {
        let newMainStateObj = Object.assign({}, mainState)
        
        newValue = getParsedNewValue( newValueParam, newMainStateObj[componentProp] )
 
        newMainStateObj[componentProp] = Util.getvarBEnsureSameType(
          newMainStateObj[componentProp],
          newValue
        )

        setMainState(newMainStateObj)
      }
      
    }

    else if(command.indexOf("SYSTEM_SELF_CONSOLE_LOG") != -1) {
        let msg = command.split('SYSTEM_SELF_CONSOLE_LOG ')[1]
        // let message = commandParams[1]
    }

    else {

    }

  }

  const systemBroadcastCommand = (command) => {

    if(command.indexOf("SYSTEM_SET_COMPONENT_MAIN_STATE") != -1) {
      let commandParams = command.split('SYSTEM_SET_COMPONENT_MAIN_STATE ')[1].split(' ')
      let childComponentId = commandParams[0]
      let componentProp = commandParams[1]
      let newValue = commandParams[2]
      // todo: handle newValue == toggle to toggle [a boolean]
      
      let newSysCommand = 'SYSTEM_SELF_SET_COMPONENT_MAIN_STATE'
      let newCommand = command.replace('SYSTEM_SET_COMPONENT_MAIN_STATE', newSysCommand)

      let myEventToDispatch: Event = new CustomEvent(
        childComponentId, 
        { detail: { value:[{command: newCommand}] } } 
      )
      window.dispatchEvent(myEventToDispatch)


      // Update component property
      // let targetComponentIndex = Util.getComponentById(myComponents, childComponentId)
      // let newComponentsArray = JSON.parse(JSON.stringify(myComponents))
      // // newComponentsArray[targetComponentIndex].props[componentProp] = newValue
      
      // newComponentsArray[targetComponentIndex].props[componentProp] = Util.getvarBEnsureSameType(
      //   newComponentsArray[targetComponentIndex].props[componentProp],
      //   newValue
      // )
      // setMyComponents(newComponentsArray)
      // // todo: set x, y, and width height if needed
      // // console.log("newValue: " + newValue)

      // if(tapDown && newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd != null) {
      //   casterOnTouchEndCommand = newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd
      //   // console.log(casterOnTouchEndCommand)
      //   // console.log(tapDown)
      // }
      
    }

  }

  const commandStringHandler = (commandString) => {
     
    if(commandString != null) {
      let myCommand = commandString
      if(myCommand.indexOf('SYSTEM_SELF') != -1) {
        systemSelfCommand(myCommand)
      }

      // Set component prop for a different omponent
      else if(myCommand.indexOf('SYSTEM_SET_COMPONENT_MAIN_STATE') != -1) {
        systemBroadcastCommand(myCommand)
      }
      else {
      // else if(myCommand.indexOf('SYSTEM_SELF')) {
        props.system.command(myCommand, {
          senderComponentId: props.id,
        })
      }
    }

  }

  const storeMacroTimeouts = (macroObject) => {
    let macroId = macroObject.firstCommand
    systemMacros[macroId] = macroObject
    // Util.stopMacroTimeoutsForMacroId('SYSTEM_SELF_CONSOLE_LOG lol')
  }

  /**
   * This function handles messages between different components.
   * 
   * @param customEvent {Event} Custom event with command details.
   */
  const componentEventHandler = (customEvent: CustomEvent) => {
    
    if(customEvent.detail?.value != null) {
// console.log(typeof customEvent.detail?.value)
// console.log(customEvent.detail?.value)
      storeMacroTimeouts(
        Util.commandMacroHandler(customEvent.detail?.value, (outputCommandStr: string) => {
          commandStringHandler(outputCommandStr)
        })
      )
    
    }

    else {
      console.log('componentEventHandler() event detail value is null')
    }
    // console.log(customEvent.detail)
    // console.log(state)
  }


  const removeTapTimeout = () => {
    if(tapTimeout != null) {
      clearTimeout(tapTimeout)
      tapTimeout = null
    }
  }

  const resetTouches = () => {
    taps = -1
  }

  const runSelfEvent = (detailValue) => {
    componentEventHandler({
      detail: {
        value: detailValue
      }
    })
  }

  const tapAction = (numTaps: number, tapType = 'onTouchEnd') => {
    if(props.taps != null) {

      // Tap event was HELD through timeout.
      if(props.taps[numTaps] != null) {
        // if(props.taps[numTaps][tapType] != null) {

          // if(tapType == 'onTouchHeld') {

            // todo: detect alt/ctrl etc. held

            let tapType = tapDown ? 'onTouchHeld' : 'onTouchEnd'
            // since we know it's our own component:
            componentEventHandler({
              detail: {
                value: props.taps[numTaps][tapType]?.default || null
              }
            })
            // console.log(props.taps[numTaps][tapType])

          // }


        // }
        // else {
        //   props.system.sendMessage(`Tap type not available at this tap level: ${numTaps}  ${tapType}`)
        // }
      }
      else {
        props.system.sendMessage(`No tap functionality available for taps: ${numTaps} tapDown: ${tapDown}`)
      }
    }
    else {
      props.system.sendMessage(`No tap functionality available for taps: ${numTaps} tapDown: ${tapDown}`, 'error')
    }
    
    removeTapTimeout()
    resetTouches()

  // }
    
    // tap was released
    // else if(type == 'end') {

    // }
  }

  // let touchesData = {  // idea: later: for gestures
  //   '0': {
  //     x: 55,
  //     y: 55,
  //     down: false,
  //     XY_history_for_gestures: []
  //   }
  // }







  // const touchStartHandler = (touchEvent: any) => {
  //   console.log(touchEvent)
  // }

  // const touchEndHandler = (touchEvent: any) => {
  //   // console.log(touchEvent)

  //   // get element released on (CANT HAVE ANY WEIRD ELEMENTS ABOVE THIS ONE!! (z-index important))
  //   console.log(
  //     document.elementFromPoint(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY)
  //   )

  //   let newEle = document.elementFromPoint(touchEvent.changedTouches[0].clientX, touchEvent.changedTouches[0].clientY)
    
  //   // let myEventToDispatch: Event = new Event(`${newEle?.getAttribute('componentid')} ${newEle?.getAttribute('systemontouchend')}`)
  //   let myEventToDispatch: Event = new CustomEvent(newEle?.getAttribute('componentid'), {'detail': {value: `${newEle?.getAttribute('systemontouchend')}`} } )

  //   window.dispatchEvent(myEventToDispatch)
  //   console.log(newEle?.getAttribute('systemontouchend'))
  // }


  // console.log(props)

  

  // if(props.id == 'copy-tap.copy-dynamic-window-tap-0') {
  //   console.log(props)
  //   console.log(mainState)
  // }
  if(mainState.componentEnabled == true) {  // or null probably (default to always enabled)
    return (
      <div className="tap-container" style={tapContainerStyle}>


        {
          // idea: mainstate.footerHTML
          (mainState.headerHTML != null && mainState.headerHTML != "") ?
          <span dangerouslySetInnerHTML={{__html: mainState.headerHTML}} />
          // <span>{mainState.headerHTML}</span>
          :
          null
        }
        

        {
          (mainComponent != null ) ?
        // mainComponent()
        // <mainComponent />
        <>
          {mainComponent}
        </>
        :
        null
        }

        {
          (dynamicComponent != null ) ?
            // <YouDraw {...props} />
            [''].map(e => {
              const MyDynamicComponent = dynamicComponentsArray[ dynamicComponent ]
              // console.log(MyDynamicComponent)
              return(
                <MyDynamicComponent key='my-dynamic-component' {...props} />
              )
            })
          :
          null
        }

        {
          (myComponents != null && myComponents.length > 0) ?
            // <div className="tap-components-container">
              <ComponentsRenderer system={props.system} components={myComponents} />
            // </div>
            :
            null
        }

      </div>
    );
  }
  else {
    return (
      null
      // <div>nothing</div>
    )
  }
};

export default Tap