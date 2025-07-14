import {
  PaginationOptions,
  PaginationResponse,
  PaginationConfig,
} from '../interfaces/pagination.interface';

export class PaginationUtil {
  private static config: PaginationConfig = {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '10'),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100'),
    defaultSortField: process.env.DEFAULT_SORT_FIELD || 'createdAt',
    defaultSortOrder:
      (process.env.DEFAULT_SORT_ORDER as 'ASC' | 'DESC') || 'DESC',
  };

  static validateAndNormalize(options: PaginationOptions): PaginationOptions {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(
      this.config.maxPageSize,
      Math.max(1, options.limit || this.config.defaultPageSize),
    );
    const sortBy = options.sortBy || this.config.defaultSortField;
    const sortOrder = options.sortOrder || this.config.defaultSortOrder;

    return { page, limit, sortBy, sortOrder };
  }

  static createPaginationResponse<T>(
    data: T[],
    total: number,
    options: PaginationOptions,
  ): PaginationResponse<T> {
    const { page, limit } = this.validateAndNormalize(options);
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  static getSkipValue(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static getTakeValue(limit: number): number {
    return Math.min(limit, this.config.maxPageSize);
  }
}
