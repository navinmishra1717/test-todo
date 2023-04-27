import { Request } from 'express';

export default class Pagination {
  static validate(req: Request) {
    const { perPage, page } = req.query;
    const limit = perPage ? parseInt(perPage as string, 10) : 10;
    const offset = page ? (+page - 1) * limit : 0;
    return {
      limit,
      offset,
      perPage: Number(perPage),
      page: Number(page),
    };
  }

  static totalPage(count: number, limit: number) {
    return Math.ceil(count / limit);
  }
}
