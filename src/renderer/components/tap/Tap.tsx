import { useState, 
  useEffect,
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
import { purple } from '@mui/material/colors';

import ComponentsRenderer from '../ComponentsRenderer'
import Util from '../../Util'

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

let taps: number = -1
let tapTimeout = null
let tapDown: Boolean = false
// (if available) touch end command that may be ran (not on SELF component, but on CASTER, which is usually self) that can do clean-up (e.g. close hover menu side, etc.)
let casterOnTouchEndCommand: any = null
let casterOnTouchStartCommand: any = null


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
      console.log("newValue: " + newValue)
console.log(
  Util.getvarBEnsureSameType(
    newComponentsArray[targetComponentIndex].props[componentProp],
    newValue
  )
)
      if(tapDown && newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd != null) {
        casterOnTouchEndCommand = newComponentsArray[targetComponentIndex].props?.casterOnTouchEnd
        console.log(casterOnTouchEndCommand)
        console.log(tapDown)
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

    else {

    }

  }

  const componentEventHandler = (customEvent: CustomEvent) => {
    if(customEvent.detail?.value != null) {
      let myCommand = customEvent.detail?.value
      if(myCommand.indexOf('SYSTEM_SELF') != -1) {
        systemSelfCommand(myCommand)
      }
      else {
      // else if(myCommand.indexOf('SYSTEM_SELF')) {
        // system.command()
      }
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

  

  const touchStartHandler = (touchEvent: any) => {
    // touchEvent.preventDefault()
    
    ++taps

    removeTapTimeout()
    tapTimeout = setTimeout(() => {tapAction(taps, 'timeout')}, props?.options?.tapWaitIntervalMS || 400); // todo: this options? question mark syntax helps mitigate JSON missings that CAN be defaults; but shouldn't always for required ones - then should crash rightlyso (with error message)

    tapDown = true

    
    if(casterOnTouchStartCommand != null) {
      runSelfEvent(casterOnTouchStartCommand)
      casterOnTouchStartCommand = null
    }
  }

  const touchEndHandler = (touchEvent: any) => {
    touchEvent.preventDefault()
    // console.log(touchEvent)

    // if(taps == 0) {
      // tapAction(taps, 'onTouchEnd')
    // }
    // removeTapTimeout()
    tapDown = false

    console.log(casterOnTouchEndCommand)
    if(casterOnTouchEndCommand != null) {
      runSelfEvent(casterOnTouchEndCommand)
      casterOnTouchEndCommand = null
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
  if(props.componentEnabled) {
      return (
        <div>

          <ColorButton 
            onTouchStart={touchStartHandler} 
            onTouchEnd={touchEndHandler} 
          >
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