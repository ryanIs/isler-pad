const Util = {

  getComponentById(componentsArray: any, componentId: string) {

    return componentsArray.findIndex(e => e.props.id == componentId)

  },

  // Returns varB but typecasted similar to varA.
  getvarBEnsureSameType(varA: any, varB: any) {
    let varAType = typeof varA
    console.log("varB: " + varB)
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

}

export default Util