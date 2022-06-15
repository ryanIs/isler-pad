import {
  red,​
  pink,​
  purple,​
  deepPurple,​
  indigo,​
  blue,​
  lightBlue,​
  cyan,​
  teal,​
  green,​
  lightGreen,​
  lime,​
  yellow,​
  amber,​
  orange,​
  deepOrange,​
  brown,​
  grey,​
  blueGrey,
} 
from '@mui/material/colors';

const MUIColorsObj = {
  'red': red,​
  'pink': pink,​
  'purple': purple,​
  'deepPurple': deepPurple,​
  'indigo': indigo,​
  'blue': blue,​
  'default': blue,​
  'lightBlue': lightBlue,​
  'cyan': cyan,​
  'teal': teal,​
  'green': green,​
  'lightGreen': lightGreen,​
  'lime': lime,​
  'yellow': yellow,​
  'amber': amber,​
  'orange': orange,​
  'deepOrange': deepOrange,​
  'brown': brown,​
  'grey': grey,​
  'blueGrey': blueGrey,
}

const Util = {

  getComponentById(componentsArray: any, componentId: string) {

    return componentsArray.findIndex(e => e.props.id == componentId)

  },

  
  containerCSSDefaultsHandler(myCSSObj, componentId = 'Tap') {
    
    if(myCSSObj.position == undefined) {
      myCSSObj.position = 'absolute'
    }

    if(myCSSObj.width == undefined) {
      myCSSObj.width = '70px'
    }

    if(myCSSObj.height == undefined) {
      myCSSObj.height = '70px'
    }
    // etc.

    if(componentId = 'DynamicWindow') {
      
      if(myCSSObj.width == undefined) {
        myCSSObj.width = '140px'
        // myCSSObj.width = '140px'
      }

      if(myCSSObj.height == undefined) {
        myCSSObj.height = '140px'
        // myCSSObj.height = '140px'
      }

    }

    return myCSSObj
  },

  // Returns varB but typecasted similar to varA.
  getvarBEnsureSameType(varA: any, varB: any) {
    let varAType = typeof varA
    // console.log("varB: " + varB)
    if(varAType == 'number') {
      // return parseInt(varB)
      return Number(varB)
    }
    else if(varAType == 'boolean') {
      return varB == 'true' || varB.toLowerCase() == 'true'
    }
    else if(varAType == 'string') {
      return String(varB)
    }
    else {
      return varB
    }
    // todo: == object
  },

  // macroObject or macroId, macroTimers
  stopMacroTimeoutsForMacroId(macroObject) {
    // map clearInterval macroId
    console.log('todo: stop macro id')
  },
  
  commandMacroHandler(commandMacro, onTimerCompleteFunction) {

    let myMacroObject = {
      firstCommand: null,
      myTimers: []
    }
// console.log(commandMacro)
    if(commandMacro != null) {
      commandMacro.map((macro, index) => {

        if(index == 0) {
          myMacroObject.firstCommand = macro.command
        }

        myMacroObject.myTimers.push(
            setTimeout(() => {
            onTimerCompleteFunction(macro.command)
          }, macro?.timeoutMS || 0)
        )
      })
    }
    else {
      console.log('commandMacroHandler() commandMacro is null')
    }

    return myMacroObject

  },

  // Converts settings json SEND_KEY key/combo input syntax for ready use by Microsoft SendKey (batch) execution.
  getSendKeyBatchStr(myInput) {
    // update: we'll just passthrough for now; we're going with AHK format for all our SEND_KEY (for now - just need to make app work quickly then we'll circle back and build dedicated functionality/parser/generics)
    /*
      see reference: https://docs.microsoft.com/en-us/dotnet/api/system.windows.forms.sendkeys?view=windowsdesktop-6.0
      e.g.
        CTRL + C:
          ^(c)
        Type exit and then hit enter:
          exit{ENTER} 

    */
   // todo lol; I must complete macros first haha
   return myInput.join('')
  },

  getMUIColorObject(colorStr: any) {
    return MUIColorsObj[colorStr]
  }

}

export default Util