export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class Pagination {
  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static getPage(limit: number, total: number, page: number): number {
    return Math.min(Math.max(page, 1), Math.ceil(total / limit) || 1);
  }

  static getTotalPages(limit: number, total: number): number {
    return Math.ceil(total / limit);
  }

  static hasNext(total: number, page: number, limit: number): boolean {
    return page < this.getTotalPages(limit, total);
  }

  static hasPrev(page: number): boolean {
    return page > 1;
  }

  static getSortOptions(sortBy?: string, sortOrder?: 'asc' | 'desc'): any {
    if (!sortBy) return { createdAt: -1 };
    return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
  }

  static buildQuery(options: PaginationOptions): {
    skip: number;
    limit: number;
    sort: any;
    filters: any;
  } {
    const { page, limit, sortBy, sortOrder, filters } = options;
    return {
      skip: this.getSkip(page, limit),
      limit: Math.min(limit, 100), // Cap at 100
      sort: this.getSortOptions(sortBy, sortOrder),
      filters: filters || {},
    };
  }

  static createMeta<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResult<T> {
    const totalPages = this.getTotalPages(limit, total);
    const currentPage = this.getPage(limit, total, page);
    
    return {
      data,
      meta: {
        page: currentPage,
        limit,
        total,
        totalPages,
        hasNext: this.hasNext(total, currentPage, limit),
        hasPrev: this.hasPrev(currentPage),
      },
    };
  }

  static async paginate<T>(
    query: any,
    options: PaginationOptions,
    mapper?: (item: any) => T,
  ): Promise<PaginatedResult<T>> {
    const { skip, limit, sort, filters } = this.buildQuery(options);

    const [data, total] = await Promise.all([
      query.find(filters).sort(sort).skip(skip).limit(limit).exec(),
      query.countDocuments(filters).exec(),
    ]);

    const mappedData = mapper ? data.map(mapper) : data;

    return this.createMeta(mappedData, total, options.page, limit);
  }

  // For Mongoose models
  static async paginateModel<T>(
    model: any,
    options: PaginationOptions,
    filters: any = {},
    populate?: any,
  ): Promise<PaginatedResult<T>> {
    const { skip, limit, sort } = this.buildQuery(options);

    let query = model.find(filters).sort(sort).skip(skip).limit(limit);
    if (populate) {
      query = query.populate(populate);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      model.countDocuments(filters).exec(),
    ]);

    return this.createMeta<T>(data, total, options.page, limit);
  }

  // For arrays
  static paginateArray<T>(
    array: T[],
    options: PaginationOptions,
  ): PaginatedResult<T> {
    const { page, limit } = options;
    const start = (page - 1) * limit;
    const end = start + limit;

    const data = array.slice(start, end);
    const total = array.length;

    return this.createMeta(data, total, page, limit);
  }
}