<script>
import VChart, { THEME_KEY } from 'vue-echarts'
import { use } from 'echarts/core'
import {
  CanvasRenderer
} from 'echarts/renderers'
import { TreeChart } from 'echarts/charts'
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  TreeChart,
  TitleComponent,
  LegendComponent,
  TooltipComponent
])

export default {
  name: 'PullRequestsGraph',
  components: {
    VChart
  },
  provide: {
    [THEME_KEY]: "dark"
  },  
  props: {
    branches: {
      type: Array,
      required: true,
    },
    tree: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    option() {
      return {
        tooltip: {
          trigger: "item",
          triggerOn: 'mouseover',
          // formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "Open Pull Requests",
            type: "tree",
            id: 0,
            data: this.tree,
            top: '15px',
            left: '20px',
            bottom: '15px',
            right: '400px',
            symbolSize: 20,
            initialTreeDepth: 3,
            lineStyle: {
              width: 3,
              curveness: 0.3,
            },
            label: {
              position: 'bottom',
              verticalAlign: 'top',
              align: 'left',
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left',
              },
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          }
        ]
      }
    }
  },
}
</script>


<template>
  <v-card :loading="loading">
    <v-chart class="chart" :option="option" />
  </v-card>
</template>

<style scoped>
.chart {
  height: 600px;
}
</style>