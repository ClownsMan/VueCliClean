<template>
  <a-form
    :form="form"
    ref="nodeForm"
    label-width="100px"
    class="flowEditForm margin13"
    size="mini"
  >
    <!-- 节点uuid -->
    <a-form-item
      label="uuid"
      style="display: none"
    >
      <a-input v-decorator="[
          'nodeId'
        ]">
      </a-input>
    </a-form-item>
    <!-- 节点名称 -->
    <a-form-item label="名称">
      <a-input
        disabled
        v-decorator="[
          'nodename',
          { rules: [{ required: true, message: '请输入节点名称！' }] }
        ]"
      ></a-input>
    </a-form-item>
    <!-- 人员配置 -->
    <template v-if="!nameDisabled">
      <!-- 人员配置 -->
      <a-form-item label="人员配置">
        <a-select
          v-decorator="[
            'nodeProcessType'
          ]"
          placeholder="请选择人员配置"
          @change="peopleTypeChange"
        >
          <a-select-option
            v-for="item in peopleTypeList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.val }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <template v-if="showType === 'peopleShow'">
        <zc-organization-select
          :multiple="peopleShowSelect.multiple"
          :rules="peopleShowSelect.rules"
          :formValue="'nodeProcess'"
          :nameList="nameList"
          @emitChange="emitChangeForPeople"
        ></zc-organization-select>
      </template>
      <template v-else-if="showType === 'workShow'">
        <a-form-item>
          <a-select
            v-decorator="[
              'nodeProcess'
            ]"
            placeholder="请选择用户组"
            @change="emitChange"
          >
            <a-select-option
              v-for="item in workData"
              :key="item.groupTagUuid"
              :value="item.groupTagUuid"
            >
              {{ item.groupTagName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <!-- v1.4.1 添加上下级 -->
      <template v-if="showType === 'superior'">
        <a-form-item>
          <a-select
            v-decorator="[
              'nodeProcess'
            ]"
            placeholder="请选择上级"
            @change="emitChangeForLevel()"
          >
            <a-select-option
              v-for="item in superiorList"
              :key="item.id"
              :value="item.id"
            >
              {{item.val}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </template>
      <!-- 指定部门 -->
      <a-form-item label="指定部门" v-if="showType === 'workShow' || showType === 'peopleShow'">
        <a-select
          v-decorator="[
            'belongsDepartment'
          ]"
          placeholder="请选择指定的部门"
          @change="emitChangeForLevel"
        >
          <a-select-option
            v-for="item in workOrgList"
            :key="item.departmentUuid"
            :value="item.departmentUuid"
          >
            {{ item.departmentName }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </template>
  </a-form>
</template>

<script>
import { getInfo, groupMemberDepartment, groupList } from '@/api/user'
export default {
  name: 'editNode',
  props: {
    peopleSort: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data () {
    return {
      form: '',
      peopleTypeList: [
        {
          id: 0,
          val: '不分配',
        },
        {
          id: 1,
          val: '分配给具体用户',
        },
        {
          id: 2,
          val: '分配给用户组',
        },
        {
          id: 3,
          val: '分配给上级'
        },
        // {
        //   id: 3,
        //   value: '分配给职位'
        // }
      ],
      nameDisabled: false, // 用来判断名字是否禁用
      userData: [], // 用户组织的数组
      showType: '', // 是否显示人员选择
      workData: [], // 用户组织的数组
      peopleShowSelect: {
        // 人员选择组件需要的参数
        multiple: false,
        rules: '请选择人员',
      },
      // nameList: [], // 需要展示的人员数组
      selectType: 'define',
      node: {}, // 表示节点的详细信息
      superiorList: [ // 上级数组
        {
          id: '1',
          val: '直接上级'
        },
        {
          id: '2',
          val: '第二上级'
        },
        {
          id: '3',
          val: '第三上级'
        },
        {
          id: '4',
          val: '第四上级'
        },
        {
          id: '5',
          val: '第五上级'
        },
        {
          id: '6',
          val: '第六上级'
        },
        {
          id: '7',
          val: '第七上级'
        },
        {
          id: '8',
          val: '第八上级'
        },
        {
          id: '9',
          val: '第九上级'
        },
      ],
      userOrgList: [], // 部门数组
      workOrgList: [], // 工作组部门数组
    };
  },
  computed: {
    nameList () {
      if(this.node.nodeProcessType != 0) {
        return this.node.nodeProcessInfos ? this.node.nodeProcessInfos : Array(this.node.nodeProcessInfo);
      }else {
        return []
      }
    },
  },
  watch: {
    peopleSort: {
      handler (newData) {
        console.log('传值进来了')
        this.node = newData;
      },
      deep: true,
    },
    node: {
      handler (newData) {
        if (newData.nodeProcessType !== 0 && this.selectType === 'define') {
          // 处理选择具体人员的显示
          if (newData.nodeProcessType == 0) {
            this.showType = '';
          } else if (newData.nodeProcessType == 1) {
            this.showType = 'peopleShow';
          } else if (newData.nodeProcessType == 2) {
            this.showType = 'workShow';
          } else if (newData.nodeProcessType == 3) {
            this.showType = 'superior';
          }
          this.$nextTick(async function () {
            this.form.setFieldsValue({
              nodeProcess: newData.nodeProcess,
            });
            if (newData.nodeProcessType == 1) {
              await this.getUserOrg(newData.nodeProcess)
            } else if (newData.nodeProcessType == 2) {
              await this.getWorkOrg(newData.nodeProcess)
            }
            this.form.setFieldsValue({
              belongsDepartment: newData.belongsDepartment,
            });
          });
        }
      },
      deep: true,
    },
  },
  created () {
    let self = this;
    this.form = this.$form.createForm(this, {
      onFieldsChange (val, fields) {},
      onValuesChange (props, values) {},
    });
    this.node = this.peopleSort;
    this.$nextTick(async function () {
      this.form.setFieldsValue({
        nodeProcess: this.node.nodeProcess,
      });
      if (this.node.nodeProcessType == 1) {
        await this.getUserOrg(this.node.nodeProcess)
      } else if (this.node.nodeProcessType == 2) {
        await this.getWorkOrg(this.node.nodeProcess)
      }
      this.form.setFieldsValue({
        belongsDepartment: this.node.belongsDepartment,
      });
    });
  },
  async mounted () {
    this.getWorkList();
  },
  methods: {
    // 获取当前人的所属部门
    async getUserOrg(userId) {
      userId = Array.isArray(userId) ? userId[0] : userId;
      let res = await getInfo(userId);
      if (res.code === '11111' && res.data) {
        let workOrgList = JSON.parse(JSON.stringify(res.data.departmentInfoList));
        workOrgList = workOrgList.map(item => {
            return {
              departmentName: item.organizationName,
              departmentUuid: item.organizationUuid
            }
        })
        this.workOrgList = workOrgList;
      }
    },
    // 获取当前工作组的所属部门
    async getWorkOrg(param) {
      param = Array.isArray(param) ? param[0] : param;
      let result = await groupMemberDepartment(param);
      if (result.code === '11111' && result.data) {
        this.workOrgList = result.data;
      }
    },
    // 获取工作组列表
    async getWorkList () {
      let result = await groupList(
        {
          isSubOrganization: true,
          isTopOrganization: true,
          organizationUuid: this.$store.getters.companyUuid,
        }
      );
      if (result.code === '11111') {
        let arr = [];
        result.data.subOrganizations.forEach(item => {
          arr = [
            ...arr,
            ...item.groupTags
          ]
        })
        let workData = JSON.parse(JSON.stringify([...result.data.groupTags, ...arr]));
        this.workData = this.$handleTreeUser(workData);
        // this.showType = 'userList';
      }
    },

    // 选择不同的人员类型
    async peopleTypeChange (val) {
      if (val === 0) {
        // 不选择
        // this.userData = [];
        this.showType = '';
        // return;
      } else if (val === 1) {
        // 选择具体的人员
        this.showType = 'peopleShow';
      } else if (val === 2) {
        // 工作组
        this.getWorkList();
        this.showType = 'workShow';
      } else if (val === 3) {
        // 上级
        this.showType = 'superior';
      }
      this.selectType = 'myself';
      this.form.setFieldsValue({
        nodeProcess: null,
        belongsDepartment: null,
      });
      this.$nextTick(() => {
        let data = this.form.getFieldsValue();
        this.$emit('nodechange', data);
      });
    },
    // 人改变触发
    async emitChangeForPeople (val) {
      this.selectType = 'myself';
      this.form.setFieldsValue({
        belongsDepartment: null,
      });
      this.$nextTick(async () => {
        let data = this.form.getFieldsValue();
        this.$emit('nodechange', data);
        await this.getUserOrg(data.nodeProcess);
      });
    },
    // 工作组改变触发
    async emitChange (val) {
      await this.getWorkOrg(val);
      this.selectType = 'myself';
      this.form.setFieldsValue({
        belongsDepartment: null,
      });
      this.$nextTick(() => {
        let data = this.form.getFieldsValue();
        this.$emit('nodechange', data);
      });
    },
        // 等级选择触发数据变化
    async emitChangeForLevel (val) {
      this.selectType = 'myself';
      this.$nextTick(() => {
        let data = this.form.getFieldsValue();
        this.$emit('nodechange', data);
      });
    },
  },
};
</script>
