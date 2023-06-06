class APIFeatures {
  constructor(query, queryString) {
    this.collection = query;
    this.query = query.find();
    this.queryString = queryString;
  }

  filter() {
    const excludedFileds = ['page', 'sort', 'limit', 'fields'];
    const queryObj = JSON.parse(
      JSON.stringify(this.queryString).replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      )
    );

    excludedFileds.forEach((el) => delete queryObj[el]);
    this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .map((el) => el.replace(/\s/g, ''))
        .join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-created_at');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(',')
        .map((el) => el.replace(/\s/g, ''))
        .join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 15;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  async getPagination(total) {
    try {
      const page = +this.queryString.page || 1;
      const limit = +this.queryString.limit || 15;
      const lastPage = Math.ceil(total / limit);
      return {
        page,
        limit,
        total,
        last_page: lastPage,
      };
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = APIFeatures;
