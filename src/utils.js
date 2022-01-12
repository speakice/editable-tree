/**
 * 修改tree，action就返回修改后的item， 不修改就不返回
 */
export const deepTree = (tree = [], action = () => {}) => {
  return tree.map((item) => {
    const newItem = action({ ...item }) || item;
    if (newItem.children) {
      newItem.children = deepTree(newItem.children, action);
    }
    return newItem;
  });
};
