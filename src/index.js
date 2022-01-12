import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Tree, Dropdown, Menu, Tabs, Input, Switch } from 'antd';
import { deepTree } from './utils';
import shortid from 'shortid';
const { DirectoryTree } = Tree;
const { TabPane } = Tabs;
const defaultTreeData = [
  {
    title: 'parent 0',
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {
        title: 'leaf 1-0',
        key: '0-1-0',
        isLeaf: true,
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        isLeaf: true,
      },
    ],
  },
];

const Demo = () => {
  const [treeData, setTreeData] = useState([...defaultTreeData]);
  const [rightClickKey, setRightClickKey] = useState();
  const [panes, setPanes] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [rightConnect, setRightConnect] = useState(true);
  const [selectedKeys, setSelectedKeys] = useState();
  const [activeTabKey, setActiveTabKey] = useState();

  const onSelect = (keys, { node }) => {
    const [selectedKey] = keys;
    rightConnect && setActiveTabKey(selectedKey);
    setSelectedKeys(keys);
    const { key, titleWord } = node;
    console.log('Trigger Select', keys, node);
    setPanes([
      ...panes.filter((item) => item.key !== key),
      { key, title: titleWord },
    ]);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };

  const onEdit = (targetKey, action) => {
    switch (action) {
      case 'remove':
        setPanes(panes.filter((item) => item.key !== targetKey));
        break;
    }
  };

  const onSearch = (value) => {
    setSearchWord(value);
  };

  const onDrop = (info) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTreeData(data);
  };

  const menu = (node) => (
    <Menu
      onClick={({ key, domEvent }) => {
        domEvent.stopPropagation();
        console.log('menuClick', node, key);
        // 如果要操作顶层文件夹（添加/删除）可以直接操作最外层数组不用递归
        switch (key) {
          case 'add':
            setTreeData(
              deepTree(treeData, (item) => {
                if (item.children && item.key === node.key) {
                  return {
                    ...item,
                    children: [
                      ...item.children,
                      {
                        title: 'new add',
                        key: shortid.generate(),
                        isLeaf: true,
                      },
                    ],
                  };
                }
              })
            );
            break;
          case 'delete':
            const outer = treeData.find((item) => item.key === node.key);
            if (outer) {
              setTreeData(treeData.filter((item) => item.key !== node.key));
              return;
            }
            setTreeData(
              deepTree(treeData, (item) => {
                if (item.children) {
                  return {
                    ...item,
                    children: item.children.filter(
                      ({ key }) => key !== node.key
                    ),
                  };
                }
                return item;
              })
            );
            break;
          case 'edit':
            setTreeData(
              deepTree(treeData, (item) => {
                if (item.key === node.key) {
                  console.log('editle', {
                    ...item,
                    title: 'new edit',
                  });
                  return {
                    ...item,
                    title: 'new edit',
                  };
                }
                return item;
              })
            );
            break;
        }
      }}
    >
      <Menu.Item key="add">新增</Menu.Item>
      <Menu.Item key="delete" danger>
        删除
      </Menu.Item>
      <Menu.Item key="edit">编辑</Menu.Item>
    </Menu>
  );
  console.log('render==', treeData);
  return (
    <div style={{ display: 'flex' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input.Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{ width: 180 }}
          />
          <Switch
            checkedChildren="关联右侧"
            unCheckedChildren="不关联右侧"
            checked={rightConnect}
            onChange={setRightConnect}
          />
        </div>
        <DirectoryTree
          style={{ width: 280 }}
          draggable
          onDrop={onDrop}
          defaultExpandAll
          onRightClick={({ node }) => setRightClickKey(node.key)}
          onSelect={onSelect}
          selectedKeys={rightConnect ? [activeTabKey] : selectedKeys}
          onExpand={onExpand}
          treeData={[
            ...deepTree(treeData, (item) => {
              return {
                ...item,
                titleWord: item.title,
                title: (
                  <Dropdown
                    visible={rightClickKey === item.key}
                    onVisibleChange={() => setRightClickKey()}
                    overlayStyle={{ width: 80 }}
                    overlay={menu(item)}
                  >
                    <span
                      style={
                        searchWord && item.title.includes(searchWord)
                          ? { color: 'red' }
                          : {}
                      }
                    >
                      {item.title}
                    </span>
                  </Dropdown>
                ),
              };
            }),
          ]}
        />
      </div>
      <Tabs
        hideAdd
        type="editable-card"
        onEdit={onEdit}
        activeKey={activeTabKey}
        onChange={setActiveTabKey}
      >
        {panes.map((pane) => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById('container'));
