import { html, PolymerElement } from '@polymer/polymer'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class'
import '@webcomponents/shadycss/entrypoints/apply-shim.js'
import '@polymer/iron-icon/iron-icon'
import '@polymer/iron-icons/iron-icons'
import '@polymer/iron-icons/social-icons'
import { BaseBehavior } from './behaviors/base-behavior'
import './behaviors/isu-elements-shared-styles.js'
import { IsuFetch } from './isu-fetch'
import './isu-tree.js'

/**

 Example:
 ```html
 ```

 ## Styling

 The following custom properties and mixins are available for styling:

 |Custom property | Description | Default|
 |----------------|-------------|----------|
 |`--isu-ui-font-family` | The font family of the picker | Microsoft YaHei
 |`--isu-ui-font-size` | The font size of the picker | 14px

 |`--isu-select-tree-collapse` | Mixin applied to the collapse tree | {}
 |`--isu-select-tree-input` | Mixin applied to the input div | {}
 |`--isu-label` | Mixin applied to the label | {}

 * @customElement
 * @polymer
 * @demo demo/isu-select-tree/index.html
 */
class IsuSelectTreeNew extends mixinBehaviors([BaseBehavior], PolymerElement) {
  static get template () {
    return html`
      <style include="isu-elements-shared-styles">
          :host {
            display: flex;
            line-height: 34px;
            font-family: var(--isu-ui-font-family), sans-serif;
            font-size: var(--isu-ui-font-size);
            position: relative;
            box-sizing: border-box;
          }
    
          #collapse-tree {
            position: absolute;
            z-index: 999;
            min-width: 225px;
            background: white;
            border: 1px solid lightgray;
            border-radius: 5px;
            height: 420px;
            overflow-y: auto;
            @apply --isu-select-tree-collapse
          }
          #collapse-tree[hidden] {
            visibility: hidden;
            height: 0;
            opacity: 0;
          }
          .input-div {
            width: 210px;
            height: 24px;
            line-height: 24px;
            border: 1px solid lightgray;
            flex: 1;
            font-family: 'Microsoft Yahei', sans-serif;
            font-size: inherit;
            padding: 4px 8px;
            min-width: inherit;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            @apply --isu-select-tree-input
          }
          .placeholder {
            color: #999;
          }
          
          #tag-content {
            flex: 1;
    
            display: flex;
            flex-wrap: wrap;
            align-content: flex-start;
            overflow-y: auto;
            padding: 2px;
          }
          
          #tag-content::-webkit-scrollbar, #select-collapse::-webkit-scrollbar {
            display: none;
          }
    
          .tag {
            max-width: calc(100% - 14px);
            color: #fff;
            background: var(--isu-ui-bg);
            border-radius: 4px;
    
            margin: 3px 2px;
            padding: 0 4px;
            min-height: 22px;
            line-height: 22px;
            /*max-width: 200px;*/
    
            display: flex;
            font-size: 14px;
            word-break: break-all;
            cursor: default;
            @apply --isu-select-tag;
          }
    
          .tag-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            @apply --isu-select-tag-name;
          }
          :host([show-all]) #tag-content {
            height: auto;
            min-height: 24px
          }
          .view-text {
             @apply --isu-view-text
          }
      </style>
      <template is="dom-if" if="[[ toBoolean(label) ]]">
         <div class="isu-label">[[label]]</div>
      </template>
      
      <div id="select__container">
        <div id="tag-content" tabindex="0" on-focus="_inputFocus" class$="input-div [[getPlaceholderClass(bindItems, placeholder)]]">
            <template is="dom-repeat" items="{{ selectedItems }}">
              <div class="tag">
                <div class="tag-name" title="{{getValueByKey(item, attrForLabel)}}">
                  {{getValueByKey(item, attrForLabel)}}
                </div>
              </div>
            </template>
          </div>
        <div id="collapse-tree" hidden>
          <isu-tree id="tree" data="{{treeData}}" bind-items="{{bindItems}}" show-checkbox="[[multi]]" 
                    require-query="[[requireQuery]]" default-expand-all search-word="{{searchWord}}" default-checked-keys="{{_defaultCheckedKeys}}"
                    check-on-click-node="[[!multi]]"></isu-tree>
        </div>
        <div class="prompt-tip__container" data-prompt$="[[prompt]]">
          <div class="prompt-tip">
            <iron-icon class="prompt-tip-icon" icon="social:sentiment-very-dissatisfied"></iron-icon>
            [[prompt]]
          </div>
        </div>
      </div>
      <template is="dom-if" if="[[_isView(isView, readonly)]]">
        <div class="view-text">
           <span>{{getViewLabels(selectedItems, attrForLabel, joinConnector)}}</span>
        </div>
      </template>
`
  }

  static get properties () {
    return {
      /**
       * 发送请求和模拟数据的组件
       */
      _fetchUtil: {
        type: Object,
        readOnly: true,
        value: function () {
          return new IsuFetch()
        }
      },
      /**
       * The fetch param of the url,for example: {id: 2}
       * */
      fetchParam: {
        type: Object
      },
      /**
       * The label of the select tree.
       * @type {string}
       */
      label: {
        type: String
      },
      attrForLabel: {
        type: String,
        value: 'label'
      },
      /**
       * The placeholder of the select.
       * @type {String}
       * @default '请选择'
       */
      placeholder: {
        type: String,
        value: '请选择'
      },
      /**
       *
       * The selected value of this select tree
       * @type {string}
       */
      value: {
        type: String,
        notify: true
      },
      /**
       * The selected item.
       * @type {object}
       */
      selectedItem: {
        type: Object,
        notify: true
      },
      /**
       * A url for fetching local data, the response data of the request should be json.
       * @type {string}
       */
      src: {
        type: String
      },
      /**
       * Attribute name for value.
       * @type {string}
       * @default 'id'
       */
      attrForValue: {
        type: String,
        value: 'id'
      },

      /**
       * Set to true, if the selection is required.
       * @type {boolean}
       * @default false
       */
      required: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * Set to true, if the select is readonly.
       * @type {boolean}
       * @default false
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * If true, hotkeys for selecting items are allowed.
       * @type {boolean}
       * @default false
       */
      enableHotkey: {
        type: Boolean,
        value: false
      },
      /**
       * shortcut key
       * @type {string}
       * @default 'enter'
       */
      shortcutKey: {
        type: String,
        value: 'Enter'
      },
      /**
       * The prompt tip to show when input is invalid.
       * @type {string}
       */
      prompt: {
        type: String
      },
      /**
       * The prompt tip's position. top/bottom
       * @type String
       * @default ''
       */
      promptPosition: {
        type: String,
        value: ''
      },
      /**
       * The data of the tree
       * @type {array}
       * @default []
       */
      treeData: {
        type: Array,
        value: [],
        notify: true
      },
      /**
       * An array of the selected items
       * @type {array}
       */
      bindItems: {
        type: Array,
        value: []
      },
      selectedItems: {
        type: Array,
        value: []
      },
      /**
       * The text mode display requires readonly=true to take effect
       * @type {boolean}
       * @default false
       * */
      isView: {
        type: Boolean,
        value: false
      },
      /**
       * The connector to connect labels when the isView=true, eg: "苹果，香蕉，梨"
       * @type {string}
       * @default ','
       * */
      joinConnector: {
        type: String,
        value: ','
      },
      multi: {
        type: Boolean,
        value: false
      },
      requireQuery: {
        type: Boolean,
        value: false
      },
      /**
       * The filter level that need to be showed in the input box. eg: '2,3'
       * */
      onlySelectLevel: {
        type: String
      },
      _defaultCheckedKeys: {
        type: Array,
        value: [],
        notify: true
      },
      showAll: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      _isDefaultCheckedKeysFlag: {
        type: Boolean,
        value: true
      }
    }
  }

  static get is () {
    return 'isu-select-tree-new'
  }

  static get observers () {
    return [
      '_bindItemsChange(bindItems)',
      '_srcChanged(src)',
      '_treeDataChanged(treeData)',
      '_valueChanged(treeData,value)',
      '__isViewChanged(isView,readonly)'
    ]
  }

  connectedCallback () {
    super.connectedCallback()
    const self = this
    window.addEventListener('click', e => {
      e.stopPropagation()
      // 点击除了组织树以外的其他地方，组织树都消失
      const composedPath = e.composedPath()
      if (!composedPath.some(item => item.tagName === 'ISU-SELECT-TREE-NEW')) {
        self.set('searchWord', null)
        self._displayCollapse(false)
      }
    })
  }

  _bindItemsChange (bindItems) {
    if (bindItems && bindItems.length > 0) {
      this.selectedItem = bindItems[0]
      const onlySelectLevelList = this.onlySelectLevel.split(',')
      let selectedItems = []
      if (onlySelectLevelList.length > 0) {
        onlySelectLevelList.forEach(level => {
          selectedItems = selectedItems.concat(bindItems.filter(item => item.level === +level))
        })
      } else {
        selectedItems = bindItems
      }
      this.set('selectedItems', selectedItems)
      this.value = bindItems.map(item => item[this.attrForValue]).join(',')
      console.log('bindItems', bindItems)
    }
  }

  _inputFocus () {
    if (!this.readonly) {
      this._displayCollapse(true)
    }
  }

  _displayCollapse (display) {
    this.$['collapse-tree'].hidden = !display
  }

  /**
   * Validate, true if the select is set to be required and this.selectedValues.length > 0, or else false.
   * @return {boolean}
   */
  validate () {
    return this.required ? !!this.value.trim() : true
  }

  getValued (bindItems, placeholder) {
    return label || placeholder
  }

  getPlaceholderClass (label, placeholder) {
    return label ? '' : 'placeholder'
  }

  _valueChanged (treeData, value) {
    const self = this
    if (this._isDefaultCheckedKeysFlag && value) {
      const _defaultCheckedKeys = this.value.split(',')
      this.set('_defaultCheckedKeys', _defaultCheckedKeys)
      this.set('_isDefaultCheckedKeysFlag', false)
    }
    if (treeData.length > 0) {
      const bindItems = []
      const getSuitIndex = function (items, singleValue) {
        if (!items) return -1
        const index = items.findIndex(item => item[self.attrForValue] == singleValue)
        if (index < 0) {
          items.forEach(item => {
            getSuitIndex(item.children, singleValue)
          })
        }
        if (index >= 0) {
          bindItems.push(items[index])
        }
        return index
      }
      const valueList = value && value.split(',')
      valueList.forEach(singleValue => {
        getSuitIndex(self.treeData, singleValue)
      })
      self.set('bindItems', bindItems)
    }
  }

  _treeDataChanged (treeData) {
    if (treeData.length > 0) {
      const getLevel = (data, level) => {
        if (!data) return
        data.forEach(item => {
          item.level = level
          if (item.children && item.children.length > 0) {
            getLevel(item.children, level + 1)
          }
        })
      }
      getLevel(this.treeData, 1)
      console.log('treedata', this.treeData)
    }
  }

  _srcChanged (src) {
    const self = this
    if (!src) return
    this.fetchParam = { id: this.value }
    const request = this._mkRequest(this.fetchParam)
    this._fetchUtil.fetchIt(request)
      .then(res => res.json())
      .then(data => {
        let items
        if (this.resultPath) {
          items = this.getValueByPath(data, this.resultPath, [])
        } else {
          items = data || []
        }

        const bindItems = []
        const getSuitIndex = function (items, singleValue) {
          if (!items || items.length === 0) return -1
          const index = items.findIndex(item => item[self.attrForValue] === singleValue)
          if (index < 0) {
            items.forEach(item => {
              getSuitIndex(item.children, singleValue)
            })
          }
          if (index >= 0) {
            self.selectedItem = items[index]
            bindItems.push(self.selectedItem)
          }
          return index
        }
        const valueList = self.value.split(',')
        valueList.forEach(singleValue => {
          getSuitIndex(items, singleValue)
        })

        this.set('treeData', items)
        this.set('bindItems', bindItems)
      })
      .catch(console.error)
  }

  _isView (isView, readonly) {
    return isView && readonly
  }

  __isViewChanged (isView, readonly) {
    this.$.select__container.style.display = (this.readonly && isView) ? 'none' : 'block'
  }

  getViewLabels (items, attrForLabel, connector) {
    const labels = items.map(item => item[attrForLabel])
    return labels.join(connector)
  }

  _mkRequest (data) {
    return {
      url: this.src,
      method: 'POST',
      headers: {
        'content-type': 'application/json;charset=utf-8',
        'Cache-Control': 'no-cache'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    }
  }
}

window.customElements.define(IsuSelectTreeNew.is, IsuSelectTreeNew)