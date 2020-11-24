<template>
  <div>
    <a-card title="审批信息">
      <a-tabs @change="callback" type="card">
        <a-tab-pane tab="流程配置" key="1" style="padding-top:20px;border-box;">
          <a-row :gutter="24">
            <a-col :span="12">
              <!-- <a-form :form="form"> -->
              <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="流程模板"
              >
                <a-select
                  style="width: 200px;"
                  @change="handleChange"
                  placeholder="请选择流程模板"
                  v-decorator="[
                    'flowInsertPoSet',
                    { rules: [{ required: true, message: '请选择流程模板' }],
                    initialValue: defaultDefineUuid }]"
                >
                  <a-select-option value="-1" disabled>请选择流程模板</a-select-option>
                  <a-select-option
                    :value="item.uuid"
                    v-for="(item, index) in tableData"
                    :key="index"
                  >{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                :label-col="formItemLayout.labelCol"
                :wrapper-col="formItemLayout.wrapperCol"
                label="所在部门"
              >
                <a-select style="width: 200px;" placeholder="选择所在部门" v-model="defineDepartUuid">
                  <a-select-option
                    :value="item.key"
                    v-for="(item, index) in userDepartList"
                    :key="index"
                  >{{ item.title }}</a-select-option>
                </a-select>
              </a-form-item>
              <!-- </a-form> -->
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane tab="流程图" key="2" :disabled="modelId === ''">
          <!-- 审批信息 -->
          <flow-staffing v-if="showFlow" :flowInfo="flowData" @handlerChange="handlerChange"></flow-staffing>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>
<script>
import {
  dictionary,
  selectInstanceRelation,
  listUserDescendantDepartmentTree,
  taskDefine,
  taskDefineRelation,
  newTaskDefine
} from "@/api/user";
import flowStaffing from "../flowStaffing/index";
export default {
  props: {
    modelDetail: {
      type: Object,
      default: function() {
        return {};
      }
    },
    selectFlow: {
      type: Object,
      default: function() {
        return {};
      }
    },
    flowTypeName: {
      type: String,
      default: ""
    },
    formItemLayout: {
      type: Object,
      default: function() {
        return {
          labelCol: { span: 6 },
          wrapperCol: { span: 18 }
        };
      }
    }
  },
  components: { flowStaffing },
  data() {
    return {
      tableData: [], // 流程模板列表
      modelId: "", // 选中的流程模板id
      showFlow: false, // 是否展示流程图
      flowInfo: {
        state: "config",
        taskData: [],
        mainInfo: {}
      },
      flowData: {},
      userData: [],
      formItemStyle: { span: 1 },
      modelType: "define",
      defaultDefineUuid: "",
      keyName: "", // 当前审批的字典对应keyName
      defineDepartUuid: "", // 指定当前人的所属部门的uuid
      userDepartList: "", // 当前人的所属部门
      defineDepartRequired: [{ required: true, message: "请选择流程模板" }] // 当前人的所属部门是否必选
      // form: this.$form.createForm(this),
    };
  },
  async mounted() {
    // 先获取默认部门
    await this.getUserOrg();
    this.selectModelType();
  },
  watch: {
    modelDetail(newData) {
      if (newData) {
        this.$nextTick(() => {
          this.$set(this.flowInfo, "state", "config");
          if (newData.instanceUuid) {
            this.modelType = "instance";
            // this.handleChange(newData.instanceUuid);
          }
          this.modelId = newData.defineUuid;
          // this.handleChange(newData.defineUuid);
        });
      }
    },
    modelId() {
      this.selectFlowInfo();
    },
    flowTypeName() {
      this.selectModelType();
    },
    defineDepartUuid(newData) {
      this.$set(this.flowData, "sponsorDepartment", newData);
      this.$emit("data-change", this.flowData);
    }
  },
  methods: {
    // 获取当前人的所属部门
    async getUserOrg() {
      let result = await listUserDescendantDepartmentTree(
        this.$store.getters.companyUuid
      );
      if (result.code === "11111" && result.data) {
        let userDepartList = this.changeOrgList(result.data.subSet);
        this.userDepartList = userDepartList;
        this.defineDepartUuid = userDepartList[0].key;
      }
    },
    //tree列表数据处理
    changeOrgList(data) {
      let newData = [];
      data.forEach(item => {
        let obj = {};
        if (item.subSet) {
          obj.children = this.changeOrgList(item.subSet);
        }
        obj.title = item.name;
        obj.value = item.uuid;
        obj.key = item.uuid;
        obj.selectable = item.types === "department" ? true : false;
        newData.push(obj);
      });
      return newData;
    },
    // 选择tab
    callback(key) {
      if (key == 2) {
        this.showFlow = true;
      } else {
        this.showFlow = false;
      }
    },
    // 选择模板触发流程图uuid更新
    handleChange(val) {
      this.modelType = "define";
      this.modelId = val;
      // this.selectFlowInfo();
    },
    // 触发data
    handlerChange(val) {
      this.flowData = val;
      this.$emit("data-change", this.flowData);
    },
    // 获取当前模板分类
    async selectModelType() {
      let result = await dictionary({
        keyName: "process_classify"
      });
      if (result.code === "11111") {
        let theme = JSON.parse(JSON.stringify(result.data.dictionary));
        let flowTypeArr = theme.filter(
          item => item.dictionaryValue === this.flowTypeName
        );
        let flowType = flowTypeArr[0].keyName;
        this.keyName = flowTypeArr[0].uuid;
        if (Object.keys(this.flowData).length > 0) {
          this.$set(this.flowData, "belongsType", this.keyName);
        }
        this.getProcessTable(flowType);
      }
    },
    /**
     * getProcessTable 获取流程模板
     * param flowType {string} 查询分类uuid
     * */
    async getProcessTable(flowType) {
      this.loading = true;
      // 新的模板查询
      let result = await newTaskDefine(
        {
          orgId: this.$store.getters.companyUuid,
          flowType: flowType
        }
      );
      if (result.code === "11111") {
        let tableData = JSON.parse(JSON.stringify(result.data));
        let defaultDefine = tableData.filter(
          item => item.defaultDefine && item.defaultDefine == 1
        );
        if (defaultDefine.length > 0) {
          this.defaultDefineUuid = defaultDefine[0].uuid;
          this.modelId = defaultDefine[0].uuid;
        }
        this.tableData = tableData;
      }
    },
    // 查询流程模板的具体信息
    async selectFlowInfo() {
      let res;
      if (this.modelType === "define") {
        res = await taskDefine(
          this.modelId
        );
      } else {
        res = await selectInstance({
          uuid: this.modelDetail.instanceUuid
        });
      }
      if (res.code === "11111") {
        let mainInfo = res.data[0];
        this.flowData = {
          // 新增指定部门
          sponsorDepartment: this.defineDepartUuid,
          belongsType: this.keyName,
          sponsorKey: this.$store.getters.userId,
          defineUuid:
            this.modelType === "define" ? mainInfo.uuid : mainInfo.defineUuid,
          state: "42",
          system: mainInfo.system,
          taskInstanceRelationPoInserts: [],
          title: mainInfo.title || ""
        };
        this.selectFlowDetail();
      }
    },
    // 查询流程节点信息
    async selectFlowDetail() {
      let res;
      if (this.modelType === "define") {
        res = await taskDefineRelation(
          this.modelId
        );
      } else {
        res = await selectInstanceRelation({
          instanceUuid: this.modelDetail.instanceUuid
        });
      }
      if (res.code === "11111") {
        let taskData = res.data;
        taskData.forEach(ele => {
          ele.nodeId = ele.uuid;
        });
        // 将流程的节点等详细信息赋值
        this.$set(this.flowData, "taskInstanceRelationPoInserts", taskData);
        this.$emit("data-change", this.flowData);
      }
    }
  }
};
</script>
<style lang="less"></style>
