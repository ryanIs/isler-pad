import { useState, 
  useEffect,
} from 'react';
import icon from '../../assets/icon.svg';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// import { styled } from '@mui/material/styles';
// import './App.css';
// import { Button } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import styled from 'styled-components'
import ComponentsRenderer from '../ComponentsRenderer'

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}));

const WindowContainer = styled.div`
  background: green;
`

/**
 * Default View is the main view that the react router loads.
 * 
 * @returns React component.
 */
const DynamicWindow = (props: any) => {
  // console.log(props)

  const componentEventHandler = (customEvent: CustomEvent) => {
    console.log(customEvent.detail)
    console.log(state)
  }

  // state contains saved variables/settings/parameters for this component.
  //   e.g. text stored in a component/radio buttons/boolean on/off switch/MIDI slider x of 128.
  //   this stuff gets saved to a JSON file (in same folder/computer as application)
  const [state, setState] = useState(props.state || {})

  // name is the label text displayed on the prop.
  const [name, setName] = useState(props.name || 'unknown_name')

  // const [myIntForRendering, setMyIntForRendering] =  useState(0)

  // on component mount
  useEffect(() => { 
    window.addEventListener(props.id, componentEventHandler)
    return () => {
      window.removeEventListener(props.id, componentEventHandler)
    }
  }, [])

  // useEffect(() => {
  //   // props = props
  //   console.log(555)
  //   setMyIntForRendering(myIntForRendering + 1)
  //   setName(Math.random())

  // }, [props])

  // const touchStartHandler = (touchEvent: any) => {
    
  //   ++taps

  //   if(tapTimeout == null) {
  //     tapsTimeout = setTimeout(() => {tapAction(taps)}, props.options.tapWaitIntervalMS);
  //   }

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
  // console.log(props.componentEnabled)
  if(props.componentEnabled) {
    return (
      <WindowContainer>

        <div className="tap-components-container">
          HI !!!
          {
            (props.components != null && props.components.length > 0) ?
              <ComponentsRenderer system={props.system} components={props.components} />
              :
              null
          }

        </div>

      </WindowContainer>
    )
  }
  else {
    return (
      null
      // <div>
      //   lol {props.componentEnabled ? 'yes':'no'} <br/>
      //   name: {name}
      // </div>
    )
  }
}

export default DynamicWindow