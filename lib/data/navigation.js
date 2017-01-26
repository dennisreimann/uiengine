/**
 * Navigation Data Structure
 *
 * @module data/navigation
 * @param {String} id the page id, i.e. `"index/child"`
 * @param {String} parentId the page id of the parent, i.e. `"index"`
 * @param {Array} parentIds the page ids of the parents in ascending order, i.e. `["index"]`
 * @param {Array} children the navigation structure of the children
 * @returns {Function} factory for creating the data structure
 */
module.exports = (id, parentId, parentIds = [], children = []) => {
  return {
    id,
    parentId,
    parentIds,
    children
  }
}
