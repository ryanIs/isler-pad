import { useState, 
  useEffect,
  useRef,
} from 'react';
import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { styled } from '@mui/material/styles';
// import './App.css';
// import { Button } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ComponentsRenderer from '../ComponentsRenderer'
import Util from '../../Util'

const ColorButton = styled(Button)<ButtonProps>(({ theme, CSSThemeOverride }) => ({
  color: theme.palette.getContrastText(Util.getMUIColorObject(CSSThemeOverride.color)[CSSThemeOverride.default]),
  backgroundColor: Util.getMUIColorObject(CSSThemeOverride.color)[CSSThemeOverride.default],
  '&:hover': {
    backgroundColor: Util.getMUIColorObject(CSSThemeOverride.color)[CSSThemeOverride.hover],
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


  // state contains saved variables/settings/parameters for this component.
  //   e.g. text stored in a component/radio buttons/boolean on/off switch/MIDI slider x of 128.
  //   this stuff gets saved to a JSON file (in same folder/computer as application)
  const [state, setState] = useState(props.state || {})

  
  const [tapContainerStyle, setTapContainerStyle] = useState( Util.containerCSSDefaultsHandler(props.containerCSS) )

  // console.log(props)
  // console.log(tapContainerStyle)

  // todo: setup defaulter func to pass through to get those || defaults
  // const [tapContainerStyle, setTapContainerStyle] = useState({
  //   width: props.width || '50px',
  //   height: props.height || '50px',
  //   top: props.top || 'none',
  //   left: props.left || 'none',
  //   right: props.right || 'none',
  //   bottom: props.bottom || 'none',
  //   zIndex: props.zIndez || 0,
  //   position: props.position || 'absolute',
  // })
  

  // const forceUpdate = useForceUpdate()

  // name is the label text displayed on the prop.
  const [name, setName] = useState(props.name || 'unknown_name')
  const [myComponents, setMyComponents] = useState(props.components || [])

  // on component mount
  useEffect(() => {
    window.addEventListener(props.id, componentEventHandler)
    
    return () => {
      window.removeEventListener(props.id, componentEventHandler)
    }
  }, [])
  
  const systemSelfCommand = (command: string) => {

    if(command.indexOf("SYSTEM_SELF_SET_COMPONENT_PROP") != -1) {
      let commandParams = command.split('SYSTEM_SELF_SET_COMPONENT_PROP ')[1].split(' ')
      let childComponentId = commandParams[0]
      let componentProp = commandParams[1]
      let newValue = commandParams[2]
      // todo: handle newValue == toggle to toggle [a boolean]
      
      // Update component property
      let targetComponentIndex = Util.getComponentById(myComponents, childComponentId)
      let newComponentsArray = JSON.parse(JSON.stringify(myComponents))
      // newComponentsArray[targetComponentIndex].props[componentProp] = newValue
      
      newComponentsArray[targetComponentIndex].props[componentProp] = Util.getvarBEnsureSameType(
        newComponentsArray[targetComponentIndex].props[componentProp],
        newValue
      )
      setMyComponents(newComponentsArray)
      // todo: set x, y, and width height if needed
      // console.log("newValue: " + newValue)
// console.log(
//   Util.getvarBEnsureSameType(
//     newComponentsArray[targetComponentIndex].props[componentProp],
//     newValue
//   )
// )
      if(tapDown && newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd != null) {
        casterOnTouchEndCommand = newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd
        // console.log(casterOnTouchEndCommand)
        // console.log(tapDown)
      }
      
      // props.components[childComponentId]

      // let targetComponentIndex = Util.getComponentById(props.components, childComponentId)
      // props.components[targetComponentIndex].componentEnabled = true

      // console.log(targetComponentIndex)

      // console.log(props.components)
      // // forceUpdate()
      // // setState({a:1})
      // Object.assign(props.components, props.components)
      // setName('lol')
    }

    else if(command.indexOf("SYSTEM_SELF_CONSOLE_LOG") != -1) {
        let msg = command.split('SYSTEM_SELF_CONSOLE_LOG ')[1]
        // let message = commandParams[1]
  
      console.log(msg)
    }

    else {

    }

  }

  const commandStringHandler = (commandString) => {

    if(commandString != null) {
      let myCommand = commandString
      if(myCommand.indexOf('SYSTEM_SELF') != -1) {
        systemSelfCommand(myCommand)
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

  const componentEventHandler = (customEvent: CustomEvent) => {
    if(customEvent.detail?.value != null) {

      storeMacroTimeouts(
        Util.commandMacroHandler(customEvent.detail?.value, (outputCommandStr: string) => {
          commandStringHandler(outputCommandStr)
        })
      )
    
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
                value: props.taps[numTaps][tapType].default
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

  const myButtonDOMRef = useRef(null)

  const touchEndHandler = (touchEvent: any) => {
    touchEvent.preventDefault()

    interactEndHandler('touch', touchEvent)
  }





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
  if(props.componentEnabled) {  // or null probably (default to always enabled)
      return (
        <div className="tap-container" style={tapContainerStyle}>

          <ColorButton 
            onTouchStart={touchStartHandler} 
            onTouchEnd={touchEndHandler} 
            onMouseDown={mouseStartHandler}
            // onMouseUp={mouseEndHandler}
            CSSThemeOverride={props.CSSThemeOverride}
            componentid={props.id}
            systemontouchend={(props.onTouchEnd == null ? null : JSON.stringify(props.onTouchEnd.default))}
            ref={myButtonDOMRef}
          >
            {/* https://stackoverflow.com/questions/4165836/javascript-scale-text-to-fit-in-fixed-div */}
            {/* <span dangerouslySetInnerHTML={{__html: name}}> </span> */}
            {name}
          </ColorButton>


          <div className="tap-components-container">

            {
              (myComponents != null && myComponents.length > 0) ?
                <ComponentsRenderer system={props.system} components={myComponents} name={name} />
                :
                null
            }

          </div>



          
          {/* <ColorButton 
          onTouchStart={touchStartHandler} 
          onTouchEnd={touchEndHandler} 
          >
            {props.name}
          </ColorButton>


          <Button variant="outlined"
          componentid={props.id}
          systemontouchend={props.taps[0].onTouchEnd.default}
          onTouchEnd={touchEndHandler} 
          
          >Hello</Button> */}

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