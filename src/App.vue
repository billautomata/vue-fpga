<template>
  <div id="app">
    <template v-for="(block,index) in blocks" v-bind:block="block" v-bind:index="index">
      <div class='lut-element' :style="calculatePosition(block)">
        P: {{block.x}}, {{block.y}}<br>
        I: {{block.inputs}}<br>
        L: {{block.luts}}<br>
        O: {{block.outputs}}<br>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {}
  },
  mounted () {
    var n = 32
    while(n--){
      this.$store.commit('INIT')
      this.$store.commit('CONFIGURE_BLOCK', { id: Object.keys(this.$store.getters.blocks).length-1 })
    }
    this.$store.commit('LAYOUT')
    var self = this
    function clock(){
      self.$store.commit('TICK')
      self.$store.commit('TOCK')
      setTimeout(clock,17)      
    }
    clock()
  },
  computed: {
    blocks: function () {
      return this.$store.getters.blocks
    }
  },
  methods: {
    calculatePosition: function (block) {
      var s = 125
      return ['top:',1.1*s*block.y,'px; left:',1.1*s*block.x,'px; width:',s,'px; height:',s,'px;'].join('')
    }
  }
}
</script>

<style>
.lut-element {
  font-size: 10px;
  font-family: monospace;
  position: absolute;
  border: 1px solid black;
  text-align: center;
}
</style>
