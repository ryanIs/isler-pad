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

import Tap from './Tap/Tap'
import DynamicWindow from './DynamicWindow/DynamicWindow'


const ComponentsRenderer = (props: any) => {
  // console.log(props)
  
  const dynamicComponentsArray: object = {
    'Tap': Tap,
    'DynamicWindow': DynamicWindow,
  }

  // const [myIntForRendering, setMyIntForRendering] =  useState(0)

  // useEffect(() => { 
  //   // props = props
  //   console.log(999)
  //   setMyIntForRendering(myIntForRendering + 1)
    
  // }, [props])

// console.log(props)
  return (
    <div className="components-container">
      {
        (props.components != null) ? 
          props.components.map((component: any, index: number) => {

            if(component != null) {

              // store global state for saving if not loaded from globalstate.json
              if(props.system.loadedGlobalStateFromJSONFile == false) {
                if(component.props != null && component.state != null && component.componentId != null) {
                  props.system.appGlobalState[component.componentId] = component.props.state
                }
              }

              if(component.componentId == 'some unique component') {
              }
              else {
                let MyCustomComponent: object = dynamicComponentsArray[component.componentId]
                if(MyCustomComponent != null) {
                  return (
                      <MyCustomComponent
                        {...component.props}
                        // key={component.props.componentEnabled}
                        key={component.props.id + '--' + index}
                        componentId={index}
                        system={props.system}
                      />
                  )
                }

                else {
                  console.log("DynamicComponent is null...")
                  console.log("DynamicComponent is null...")
                  console.log("DynamicComponent is null...")
                  console.log(MyCustomComponent)
                  console.log(dynamicComponentsArray)
                }
              }
            }

          })
          :
          null
      }
    </div>
  );
};

export default ComponentsRenderer