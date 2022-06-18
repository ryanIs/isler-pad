import { useState, 
  useEffect,
  useRef,

} from 'react';
// import { styled } from '@mui/material/styles';
import './YouDraw.css';
// import { Button } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { purple } from '@mui/material/colors';
import styled from 'styled-components'

import ComponentsRenderer from '../ComponentsRenderer'
import Util from '../../Util'


var canvas, ctx, flag = false,
prevX = 0,
currX = 0,
prevY = 0,
currY = 0,
dot_flag = false;

var x = "black",
y = 2;

let w = 10, h = 10

/**
 * Default View is the main view that the react router loads.
 * 
 * @returns React component.
 */
const YouDraw = (props: any) => {
  // console.log(props)

  const componentEventHandler = (customEvent: CustomEvent) => {
    // console.log(customEvent.detail)
    // console.log(state)
  }

  // state contains saved variables/settings/parameters for this component.
  //   e.g. text stored in a component/radio buttons/boolean on/off switch/MIDI slider x of 128.
  //   this stuff gets saved to a JSON file (in same folder/computer as application)
  // const [state, setState] = useState(props.state || {})
  const [state, setState] = useState({})

  // name is the label text displayed on the prop.
  // const [name, setName] = useState(props.name || 'unknown_name')

  // const [containerStyle, setContainerStyle] = useState(Util.containerCSSDefaultsHandler( props.containerCSS, props.componentId ) )

  // const [myIntForRendering, setMyIntForRendering] =  useState(0)

  // on component mount
  useEffect(() => { 
    init()
    // window.addEventListener(props.id, componentEventHandler)
    // return () => {
      // window.removeEventListener(props.id, componentEventHandler)
    // }
  }, [])


    
    const canvasRef = useRef(null)

    function init() {
        // canvas = document.getElementById('can');
        canvas = canvasRef.current
        ctx = canvas.getContext("2d");
        w = canvas.width;
        h = canvas.height;
    
        // todo: make it work with touch events
        canvas.addEventListener("mousemove", function (e) {
            findxy('move', e)
        }, false);
        canvas.addEventListener("mousedown", function (e) {
            findxy('down', e)
        }, false);
        canvas.addEventListener("mouseup", function (e) {
            findxy('up', e)
        }, false);

        canvas.addEventListener("touchmove", function (e) {
            findxy('move', e, 'touch')
        }, false);
        canvas.addEventListener("touchstart", function (e) {
            findxy('down', e, 'touch')
        }, false);
        canvas.addEventListener("touchend", function (e) {
            findxy('up', e, 'touch')
        }, false);
        // canvas.addEventListener("mouseout", function (e) {
        //     findxy('out', e)
        // }, false);

        fitCanvasToParent()
    }
    
    function color(event) {
      let obj = event.target
      // console.log(obj)
        switch (obj.id) {
            case "green":
                x = "green";
                break;
            case "blue":
                x = "blue";
                break;
            case "red":
                x = "red";
                break;
            case "yellow":
                x = "yellow";
                break;
            case "orange":
                x = "orange";
                break;
            case "black":
                x = "black";
                break;
            case "white":
                x = "white";
                break;
        }
        if (x == "white") y = 14;
        else y = 2;
    
    }
    
    function draw() { 
      // console.log("currX: " + currX)
      // console.log("currY: " + currY)
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();
    }

    function fitCanvasToParent() {
      ctx.canvas.width = parseFloat( props.containerCSS.width )
      ctx.canvas.height = parseFloat( props.containerCSS.height )
    }
    
    function eraseCanvas() {
      ctx.clearRect(0, 0, 3000, 3000);
      // document.getElementById("canvasimg").style.display = "none";
    }
    
    // todo: this is useful for saving
    // function save() {
    //     document.getElementById("canvasimg").style.border = "2px solid";
    //     var dataURL = canvas.toDataURL();
    //     document.getElementById("canvasimg").src = dataURL;
    //     document.getElementById("canvasimg").style.display = "inline";
    // }
    
    function findxy(res, e, isTouch=false) {

      let eclientX = e.clientX
      let eclientY = e.clientY

      if(isTouch) {
        if(e.touches[0] == null) {
          // console.log('touches0 is null')
          return
        }
        if(e.preventDefault)
          e.preventDefault()
        eclientX = e.touches[0].clientX
        eclientY = e.touches[0].clientY
      }
      // console.log(e)
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = eclientX - parseFloat( props.containerCSS.left || 0 );
            currY = eclientY - parseFloat( props.containerCSS.top || 0 );
    
            flag = true;
            dot_flag = true;
            if (dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(currX, currY, 2, 2);
                ctx.closePath();
                dot_flag = false;
            }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = eclientX - parseFloat( props.containerCSS.left || 0 );
                currY = eclientY - parseFloat( props.containerCSS.top || 0 );
    
                draw();
            }
        }
    }

    // objective: pass in styling like tapContainerStyle from JSOn. (e.g. then we can do custom borders etc.)
  return (
    <div className="you-draw-container" style={{width: '100%', height: '100%', border: '1px solid #ddf', position: 'relative', }}>

      <div className="canvas-controls" style={{position: 'absolute', }}>
        
        <span style={{background: 'gray', }} id="clear" onClick={(e) => eraseCanvas()}> X </span>
        {/* <span style={{background: 'green', }} id="clear" onClick={(e) => save()"></s}an> */}
        <span style={{background: 'green', }} id="green" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{background: 'blue', }} id="blue" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{background: 'red', }} id="red" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{background: 'yellow', }} id="yellow" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{background: 'orange', }} id="orange" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{background: 'black', }} id="black" onClick={(e) => color(e)}> &nbsp; </span>
        <span style={{width: '16px', height: '15px', background: 'white', }} id="white" onClick={(e) => color(e)}> &nbsp; </span>
        

      </div>

      <canvas ref={canvasRef}></canvas>

    </div>
  )

  // console.log(props)
  // console.log(props.componentEnabled)
  // if(props.componentEnabled) {
  //   return (
  //     <div className="dynamic-window-container" style={containerStyle}>

  //       <div className="dynamic-window-components-container" style={{width: '100%', height: '100%',}}>

  //         {
  //           (props.components != null && props.components.length > 0) ?
  //             <ComponentsRenderer system={props.system} components={props.components} />
  //             :
  //             null
  //         }

  //       </div>

  //     </div>
  //   )
  // }
  // else {
  //   return (
  //     null
  //     // <div>
  //     //   lol {props.componentEnabled ? 'yes':'no'} <br/>
  //     //   name: {name}
  //     // </div>
  //   )
  // }
}

export default YouDraw