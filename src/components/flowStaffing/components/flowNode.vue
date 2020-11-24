<template>
  <div
    :class="`node-item ${node.class} state${node.state}`"
    ref="node"
    :style="flowNodeContainer"
    @mouseenter="showDelete"
    @mouseleave="hideDelete"
    @mouseup="changeNodeSite"
    @click.stop="editNode"
  >
    <template v-if="nodeType === 'define'">
      <div class="node-con">
        <span v-if="node.engineType == 'USER' && !inputShow">{{ node.nodeName }}</span>
      </div>
    </template>
    <template v-else>
      <a-popover title="节点信息">
        <template
          v-if="node.engineType == 'USER'"
          slot="content"
        >
          <p>节点名称: {{node.nodeName}}</p>
          <p v-if="node.nodeProcessInfo">处理人: {{node.nodeProcessInfo.name}}</p>
          <p v-else-if="!node.nodeProcessInfo && node.nodeProcessType == 2">处理人: {{ '标签-' + node.nodeProcessName }}</p>
          <p v-else-if="!node.nodeProcessInfo && node.nodeProcessType == 3">处理人: 上级</p>
        </template>
        <div class="node-con">
          <span v-if="node.engineType == 'USER' && !inputShow">{{ node.nodeName }}</span>
        </div>
      </a-popover>
    </template>
    <!--连线用--//触发连线的区域-->
    <div
      class="flow-node-drag"
      v-if="isconnect"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    isconnect: Boolean,
    state: String,
    nodeType: String,
  },
  data () {
    return {
      mouseEnter: false,
      inputShow: false, // 是否显示input框
    };
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get () {
        return {
          position: 'absolute',
          top: this.node.top,
          left: this.node.left,
          boxShadow: this.mouseEnter ? '#66a6e0 0px 0px 12px 0px' : '',
        };
      },
    },
  },
  methods: {
    // 删除节点
    deleteNode () {
      this.$emit('delete-node', this.node.nodeId);
    },
    // 编辑节点
    editNode () {
      this.$emit('edit-node', this.node.nodeId);
    },
    // 鼠标进入
    showDelete () {
      this.mouseEnter = true;
    },
    // 鼠标离开
    hideDelete () {
      this.mouseEnter = false;
    },
    // 鼠标移动后抬起
    changeNodeSite () {
      this.$emit('changeNodeSite', {
        nodeId: this.node.nodeId,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top,
      });
    },
  },
};
</script>
<style scoped>
.node-item {
  border-radius: 4px;
  box-shadow: 0 0 2px #696969;
  cursor: move;
  overflow: initial;
  background: rgb(96, 151, 253);
  padding: 0 10px;
  min-width: 80px;
  box-sizing: border-box;
}

.node-item.start {
  min-width: 40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #289b0f;
}

.node-item.end {
  min-width: 40px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e94141;
}

.node-item.and,
.node-item.or {
  display: inline-block;
  transform: rotate(45deg);
  min-width: 40px;
  width: 40px;
  height: 40px;
  background: #d4d2ca;
}

.node-item.user.state42 {
  background: skyblue;
}
.node-item.user.state43 {
  background: rgb(0, 140, 255);
}
.node-item.user.state40 {
  background: #bcdafa;
}
.node-item.user.state41 {
  background: #bcdafa;
}

/* .node-titel {
  height: 20px;
  background: #ffc400;
} */

/* .node-icon {
  position: absolute;
  top: 0px;
  right: 0px;
  line-height: 20px;
}

.node-icon i {
  cursor: pointer;
} */

.node-con {
  text-align: center;
  line-height: 40px;
}
/* 设置开始，结束 */
.node-item.start .node-con {
  line-height: 50px;
}

.node-item.end .node-con {
  line-height: 50px;
}
/* 设置并集，或集 */
.node-item.and .node-con i {
  font-size: 30px;
  line-height: 48px;
  transform: rotate(-45deg);
}

.node-item.or .node-con i {
  font-size: 30px;
  line-height: 48px;
  transform: rotate(-45deg);
}

.node-del {
  position: absolute;
  color: red;
  font-size: 16px;
  cursor: pointer;
  top: -8px;
  right: -8px;
}

.flow-node-drag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: crosshair;
}

.nodeInput {
  width: 100px;
  height: 100%;
}
</style>
