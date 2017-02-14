/**
 * Navigation Data Structure
 *
 * @module data/navigation
 * @param {String} id the page id, i.e. `"index/child"`
 * @param {String} parentId the page id of the parent, i.e. `"index"`
 * @param {Array} parentIds the page ids of the parents in ascending order, i.e. `["index"]`
 * @param {Array} childIds the page ids of the children
 * @param {Array} siblingBeforeId the page id of the sibling before the page
 * @param {Array} siblingsBeforeIds the page ids of the siblings before the page
 * @param {Array} siblingAfterId the page id of the sibling after the page
 * @param {Array} siblingsAfterIds the page ids of the siblings after the page
 * @returns {Function} factory for creating the data structure
 */
module.exports = (id, parentId, parentIds = [], childIds = [], siblingBeforeId, siblingsBeforeIds = [], siblingAfterId, siblingsAfterIds = []) => {
  return {
    id,
    parentId,
    parentIds,
    childIds,
    siblingBeforeId,
    siblingsBeforeIds,
    siblingAfterId,
    siblingsAfterIds
  }
}
