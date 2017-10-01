import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    blocks: {},
    width: 8
  },
  getters: {
    blocks: function (state) {
      return state.blocks
    }
  },
  mutations: {
    INIT: function(state, payload) {
      var n_elements = Object.keys(state.blocks).length
      var o = {}
      o[n_elements] = {
        x: 0,
        y: 0,
        inputs: [0,0,0,0],
        outputs: [0,0,0,0],
        luts: [0,0,0,0]
      }
      state.blocks = Object.assign({}, state.blocks, o)
    },
    LAYOUT: function (state) {
      Object.keys(state.blocks).forEach(function(id,i){
        var y = Math.floor(i/state.width)
        var x = i - (state.width * y)
        Vue.set(state.blocks[id], 'x', x)
        Vue.set(state.blocks[id], 'y', y)
      })
    },
    CONFIGURE_BLOCK: function(state, payload) {
      state.blocks[payload.id].luts.forEach(function(v,i){
        Vue.set(state.blocks[payload.id].luts, i, Math.floor(Math.random()*4))
      })
    },
    TICK: function (state, payload) {
      // iterate over each block operate the luts with the inputs
      // iterate over each block and copy the outputs of the other block into his own
      Object.keys(state.blocks).forEach(function(id,i){
        var block = state.blocks[id]
        block.luts.forEach(function(lut_value,lut_index){
          var output_value = 0
          var input0_index = lut_index % block.inputs.length
          var input1_index = (lut_index + 1) % block.inputs.length
          if(lut_value === 0){
            // NAND
            output_value = luts.NAND(block.inputs[input0_index], block.inputs[input1_index])
          } else if (lut_value === 1){
            // NOR
            output_value = luts.NOR(block.inputs[input0_index], block.inputs[input1_index])
          } else if (lut_value === 2){
            // OR
            output_value = luts.OR(block.inputs[input0_index], block.inputs[input1_index])
          } else if (lut_value === 3){
            // AND
            output_value = luts.AND(block.inputs[input0_index], block.inputs[input1_index])
          }
          Vue.set(block.outputs, lut_index, output_value)
        })
      })
    },
    TOCK: function (state, payload) {
      // iterate over each block and copy the outputs of the other block into his own
      var n_blocks = Object.keys(state.blocks).length
      Object.keys(state.blocks).forEach(function(id,i){
        var block = state.blocks[id]
        var x = block.x
        var y = block.y
        var indexes = [
          [x,y-1],
          [x+1,y],
          [x,y+1],
          [x-1,y],
        ]
        indexes.forEach(function(index){
          if(index[0] < 0 || index[0] > state.width-1 || index[1] < 0 || index[1] > (Math.floor(n_blocks/state.width))-1){
            // console.log('index out of bounds', x,y,index)
          } else {
            // find other block, copy the outputs to my inputs
            var other_index = (index[1] * state.width) + index[0]
            state.blocks[other_index].outputs.forEach(function(output_value, output_index){
              Vue.set(state.blocks[id].inputs, output_index, output_value)
            })
          }
        })
      })
    }
  }
})

var luts = {
  NAND: function(a,b){
    if(a === 0 && b === 0){ return 1 }
    if(a === 0 && b === 1){ return 1 }
    if(a === 1 && b === 0){ return 1 }
    if(a === 1 && b === 1){ return 0 }
  },
  AND: function(a,b){
    if(a === 0 && b === 0){ return 0 }
    if(a === 0 && b === 1){ return 0 }
    if(a === 1 && b === 0){ return 0 }
    if(a === 1 && b === 1){ return 1 }
  },
  NOR: function(a,b){
    if(a === 0 && b === 0){ return 1 }
    if(a === 0 && b === 1){ return 0 }
    if(a === 1 && b === 0){ return 0 }
    if(a === 1 && b === 1){ return 0 }
  },
  OR: function(a,b){
    if(a === 0 && b === 0){ return 0 }
    if(a === 0 && b === 1){ return 1 }
    if(a === 1 && b === 0){ return 1 }
    if(a === 1 && b === 1){ return 1 }
  },
}
