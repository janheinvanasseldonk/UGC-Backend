const paginate = (params) => {
  const { page, pageSize } = params;

  const offset = page * pageSize;
  const limit = pageSize;

  return {
    offset,
    limit,
  };
};

module.exports = paginate;
