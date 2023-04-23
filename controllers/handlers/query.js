function handleQuery(req) {
  // Look for query sort parameters
  let sort = req.query.sort;
  // Look for query limit
  let limit = req.query.limit;
  // Look for quey sort order
  let order = req.query.order;

  let sortObject = {};
  if (sort === "date") {
    // Sort with date
    sortObject.created_at = order === "asc" ? 1 : -1;
  } else if (sort === "like") {
    // sort with like
    sortObject.like_count = order === "asc" ? 1 : -1;
  }
  return {
    sortObject,
    limit,
  };
}

module.exports = { handleQuery };
