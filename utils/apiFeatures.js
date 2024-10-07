class TodoFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? this.queryStr.keyword.trim() : '';
    if (keyword) {
      this.query = this.query
        .where('title', 'like', `%${keyword}%`)
        .orWhere('description', 'like', `%${keyword}%`);
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    delete queryCopy.keyword;
    delete queryCopy.limit;
    delete queryCopy.page;

    const filterFields = ['completed', 'createdAt', 'tasks'];
    const filters = Object.entries(queryCopy).filter(
      ([key, value]) => filterFields.includes(key) && value !== '',
    );

    if (filters.length > 0) {
      this.query = this.query.where((builder) => {
        filters.forEach(([field, value], index) => {
          if (index === 0) {
            builder.where(field, value);
          } else {
            builder.orWhere(field, value);
          }
        });
      });
    }

    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).offset(skip);
    return this;
  }
}

module.exports = TodoFeatures;
