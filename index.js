import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Tree, Dropdown, Menu, Button } from 'antd';
import { deepTree } from './utils';
const { DirectoryTree } = Tree;
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
  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = () => {
    console.log('Trigger Expand');
  };
  console.log(
    'data',
    treeData,
    deepTree(treeData, (item) => item),
    defaultTreeData
  );

  const menu = (node) => (
    <Menu
      onClick={(key) => {
        console.log('menuClick', node);
        switch (key) {
          case 'add':
            setTreeData(
              deepTree(treeData, (item) => {
                if (item.children && item.key === node.key) {
                  item.children.push({
                    title: 'new add',
                    key: 'new add',
                    isLeaf: true,
                  });
                  return item;
                }
              })
            );
            break;
          case 'delete':
            console.log(
              'render==',
              deepTree(treeData, (item) => {
                if (item.children)
                  item.children = item.children.filter(
                    ({ key }) => key !== '0-1-1'
                  );
                return item;
              })
            );
            // deepTree(treeData, (item) => {
            //   if (item.children)
            //     item.children = item.children.filter(
            //       ({ key }) => key !== node.key
            //     );
            //   return item;
            // })
            // setTreeData(
            //   deepTree(treeData, (item) => {
            //     if (item.children)
            //       item.children = item.children.filter(
            //         ({ key }) => key !== node.key
            //       );
            //     return item;
            //   })
            // );
            break;
          case 'edit':
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
  console.log(
    'render==',
    deepTree(treeData, (item) => {
      if (item.children)
        item.children = item.children.filter(({ key }) => key !== '0-1-1');
      return item;
    })
  );
  return (
    <div>
      <DirectoryTree
        defaultExpandAll
        onRightClick={({ node }) => setRightClickKey(node.key)}
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={[
          ...deepTree(treeData, (item) => {
            console.log('0000');
            return {
              ...item,
              title: (
                <Dropdown
                  visible={rightClickKey === item.key}
                  onVisibleChange={() => setRightClickKey()}
                  overlayStyle={{ width: 80 }}
                  overlay={menu(item)}
                >
                  <span>{item.title}</span>
                </Dropdown>
              ),
            };
          }),
        ]}
      />
    </div>
  );
};

ReactDOM.render(<Demo />, document.getElementById('container'));
