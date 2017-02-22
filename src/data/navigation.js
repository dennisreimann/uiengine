module.exports = (id, title, path, childIds = [], parentId, { parentIds = [], siblingBeforeId = null, siblingsBeforeIds = [], siblingAfterId = null, siblingsAfterIds = [] } = {}) => {
  return {
    id,
    title,
    path,
    childIds,
    parentId,
    parentIds,
    siblingBeforeId,
    siblingsBeforeIds,
    siblingAfterId,
    siblingsAfterIds
  }
}
