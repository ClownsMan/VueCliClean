<template>
  <div>
    <div
      id="flowContent"
      ref="flowContent"
    >
      <!-- 对于环节的颜色注释 -->
      <div
        class="note"
        v-if="flowType === 'example'"
      >
        <a-row>
          <a-col>待完成 : </a-col>
          <a-col>
            <span style="background: rgb(0, 140, 255);display: block;width:50px;height:20px;"></span>
          </a-col>
        </a-row>
        <a-row>
          <a-col>进行中 : </a-col>
          <a-col>
            <span style="background: skyblue;display: block;width:50px;height:20px;"></span>
          </a-col>
        </a-row>
        <a-row>
          <a-col>已完成 : </a-col>
          <a-col>
            <span style="background: #bcdafa;display: block;width:50px;height:20px;"></span>
          </a-col>
        </a-row>
      </div>
      <!-- 节点渲染 -->
      <flowNode
        v-for="node in nodeList"
        :key="node.uuid"
        :node="node"
        :id="node.uuid"
        :nodeType="flowType"
        @edit-node="showDrawer(node)"
      >
      </flowNode>
      <!-- 抽屉 -->
      <a-drawer
        :destroyOnClose="destroyOnClose"
        title="人员配置"
        placement="right"
        :closable="false"
        @close="onClose"
        :visible="visible"
        :getContainer="false"
        :wrapStyle="{ position: 'absolute' }"
      >
        <edit-node
          :peopleSort="currentNode"
          ref="nodeContainer"
          @nodechange="nodechange"
        ></edit-node>
      </a-drawer>
    </div>
  </div>
</template>
<script>
import { taskDefineRelation, selectInstanceRelation } from '@/api/user'
import flowNode from './components/flowNode';
import editNode from './components/editNode';
import { jsplumbSetting } from './data/jsplumbConfig.js';
import { jsPlumb } from 'jsplumb';
export default {
  components: { flowNode, editNode },
  props: {
    //  流程uuid
    flowUuid: {
      type: String,
      default: function () {
        return '';
        // return 'abcdb19a1b954900b89dcfc4d5c5da88';
      },
    },
    // 模板类型 define-模板, example-实例
    flowType: {
      type: String,
      default: function () {
        return 'define';
      },
    },
    // 流程详细信息
    flowInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data () {
    return {
      visible: false, // 展示抽屉
      // flowNodeList: [], // 所有节点数组
      // nodeList: [], // 非连接线节点数组
      data: {}, // 流程的所有信息
      jsPlumb: null,
      jsplumbSetting, // 流程配置
      currentNode: {}, // 当前节点
      destroyOnClose: true, // 抽屉的销毁
    };
  },
  computed: {
    flowNodeList () {
      if (this.data.taskInstanceRelationPoInserts) {
        return this.data.taskInstanceRelationPoInserts;
      }
    },
    nodeList () {
      if (this.data.taskInstanceRelationPoInserts) {
        let nodeList = this.handerFlowList(this.data.taskInstanceRelationPoInserts);
        return nodeList;
      }
    },
  },
  watch: {
    flowUuid: {
      handler (newData, oldData) {
        this.init(newData);
      },
      deep: true,
    },
    flowInfo: {
      handler: function (newData, oldData) {
        this.data = newData;
      },
      deep: true,
    },
  },
  async created () {
    if (Object.keys(this.flowInfo).length > 0) {
      this.data = this.flowInfo;
    } else if(this.flowUuid != '') {
      await this.init(this.flowUuid);
    }
  },
  async mounted () {
    this.jsPlumb = jsPlumb.getInstance();
    if (Object.keys(this.flowInfo).length != 0) {
      this.initFlow();
    }
  },
  methods: {
    async init (flowUuid) {
      let res;
      if (this.flowType === 'define') {
        res = await taskDefineRelation(this.flowUuid);
      } else {
        res = await selectInstanceRelation(
          {
            instanceUuid: this.flowUuid,
          }
        );
      }
      if (res.code === '11111') {
        let taskList = res.data;
        taskList.forEach(item => {
          if (item.parentId && !Array.isArray(item.parentId)) {
            item.parentIds = item.parentId.indexOf(',') != -1 ? item.parentId.split(',') : Array(item.parentId);
          }
        });
        this.data = {
          taskInstanceRelationPoInserts: taskList,
        };
        this.initFlow();
      }
    },
    // 所有的节点挑选出需要渲染的节点信息
    handerFlowList (data) {
      let nodeList = [];
      data.forEach(item => {
        if (item.parentId && !Array.isArray(item.parentId)) {
          item.parentIds = item.parentId.indexOf(',') != -1 ? item.parentId.split(',') : Array(item.parentId);
        }
        if (item.engineType !== 'COND') {
          item.top = Number(item.position.split(',')[1]) + 'px';
          item.left = Number(item.position.split(',')[0]) + 'px';
          // item.top = Number(item.position.split(',')[1]) / 2 + 'px';
          // item.left = Number(item.position.split(',')[0]) / 2 + 'px';
          item.class = item.engineType.toLocaleLowerCase();
          nodeList.push(item);
        }
      });
      return nodeList;
    },
    // 初始化流程
    initFlow () {
      const _this = this;
      this.jsPlumb.ready(function () {
        // 会使整个jsPlumb立即重绘。
        _this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化画线
        _this.loadEasyFlow();
      });
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化连线
      const _this = this;
      for (let i = 0; i < this.nodeList.length; i++) {
        let node = this.nodeList[i];
        if (node.engineType !== 'START') {
          for (let j = 0; j < node.parentIds.length; j++) {
            const parent = this.selectFont(node.parentIds[j]);
            this.$nextTick(() => {
              _this.jsPlumb.connect({
                source: parent,
                target: node.uuid,
                ...this.jsplumbSetting,
              });
            });
          }
        }
      }
    },
    //查询节点上级是哪个节点
    selectFont (id) {
      const arr = this.flowNodeList.filter(item => item.uuid === id);
      return arr[0].parentIds[0];
    },
    // 节点详情发生改变
    nodechange (val) {
      console.log('节点详情发生改变', val)
      let taskList = JSON.parse(JSON.stringify(this.data.taskInstanceRelationPoInserts));
      taskList.forEach((item, index) => {
        if (item.nodeId === val.nodeId) {
          taskList.splice(index, 1, {
            ...item,
            nodeProcessType: val.nodeProcessType,
            nodeProcess: Array.isArray(val.nodeProcess) ? val.nodeProcess : Array(val.nodeProcess),
            belongsDepartment: val.belongsDepartment ? val.belongsDepartment : item.belongsDepartment,
          });
          return;
        }
      });
      this.$set(this.data, 'taskInstanceRelationPoInserts', taskList);
      // 触发父组件节点改变,只传送节点数组
      this.$emit('handlerChange', this.data);
    },
    showDrawer (val) {
      // 先判断是否时用户任务节点
      if (val.engineType === 'USER') {
        // 在判断区分是配置还是展示
        if (this.flowType === 'define') {
          this.currentNode = JSON.parse(JSON.stringify(val));
          this.visible = true;
          this.$nextTick(() => {
            if (this.$refs.nodeContainer) {
              // 重置表单
              this.$refs.nodeContainer.$refs.nodeForm.form.resetFields();
              // 表单赋值
              console.log('重新赋值')
              this.$refs.nodeContainer.$refs.nodeForm.form.setFieldsValue({
                nodeId: val.nodeId,
                nodename: val.nodeName,
                nodeProcessType: Number(val.nodeProcessType),
                // nodeProcessInfos: val.nodeProcessInfos,
                nodeProcess: val.nodeProcess,
              });
            }
          })
        }
      }
    },
    onClose () {
      this.visible = false;
    },
  },
};
</script>
<style lang="less">
#flowContent {
  width: 100%;
  height: 500px;
  position: relative;
  .note {
    position: absolute;
    right: 0;
    top: 10px;
  }
}
</style>
