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
import styled from 'styled-components'

import Tap from './Tap/Tap'
// import DynamicWindow from './DynamicWindow/DynamicWindow'

const DivComponentsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

const ComponentsRenderer = (props: any) => {
  // console.log(props)
  

  // const [myIntForRendering, setMyIntForRendering] =  useState(0)

  // useEffect(() => { 
  //   // props = props
  //   console.log(999)
  //   setMyIntForRendering(myIntForRendering + 1)
    
  // }, [props])

  const [myComponents, setMyComponents] = useState(props.components || [])

  useEffect(() => { 
    // props = props
    // console.log('CRRRRRRRRRR: updated!!')
    setMyComponents(props.components)
  }, [props.components])

// console.log(props)
  return (
    <DivComponentsContainer>
      {
        (myComponents != null) ? 
          myComponents.map((component: any, index: number) => {

            if(component != null) {

              // store global state for saving if not loaded from globalstate.json
              if(props.system.loadedGlobalStateFromJSONFile == false) {
                if(component.props != null && component.state != null && component.props.id != null) {
                  props.system.appGlobalState[component.props.id] = component.props.state
                }
              }

              // if(component.props.id == 'youDraw-app') {
              //   console.log('------------ ComponetsRenderer mainState: ')
              //   console.log(component.props.mainState)

                
              // setInterval(() => {
              //   console.log(component.props.mainState)
              // }, 1000);
              // }

              return (
                  <Tap
                    {...component.props}
                    // key={component.props.componentEnabled}
                    key={component.props.id + '--' + index}
                    componentsIndex={index}
                    system={props.system}
                  />
              )
                
            }

          })
          :
          null
      }
    </DivComponentsContainer>
  );
};

export default ComponentsRenderer