"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
class Pagination {
    static getSkip(page, limit) {
        return (page - 1) * limit;
    }
    static getPage(limit, total, page) {
        return Math.min(Math.max(page, 1), Math.ceil(total / limit) || 1);
    }
    static getTotalPages(limit, total) {
        return Math.ceil(total / limit);
    }
    static hasNext(total, page, limit) {
        return page < this.getTotalPages(limit, total);
    }
    static hasPrev(page) {
        return page > 1;
    }
    static getSortOptions(sortBy, sortOrder) {
        if (!sortBy)
            return { createdAt: -1 };
        return { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    }
    static buildQuery(options) {
        const { page, limit, sortBy, sortOrder, filters } = options;
        return {
            skip: this.getSkip(page, limit),
            limit: Math.min(limit, 100),
            sort: this.getSortOptions(sortBy, sortOrder),
            filters: filters || {},
        };
    }
    static createMeta(data, total, page, limit) {
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
    static async paginate(query, options, mapper) {
        const { skip, limit, sort, filters } = this.buildQuery(options);
        const [data, total] = await Promise.all([
            query.find(filters).sort(sort).skip(skip).limit(limit).exec(),
            query.countDocuments(filters).exec(),
        ]);
        const mappedData = mapper ? data.map(mapper) : data;
        return this.createMeta(mappedData, total, options.page, limit);
    }
    static async paginateModel(model, options, filters = {}, populate) {
        const { skip, limit, sort } = this.buildQuery(options);
        let query = model.find(filters).sort(sort).skip(skip).limit(limit);
        if (populate) {
            query = query.populate(populate);
        }
        const [data, total] = await Promise.all([
            query.exec(),
            model.countDocuments(filters).exec(),
        ]);
        return this.createMeta(data, total, options.page, limit);
    }
    static paginateArray(array, options) {
        const { page, limit } = options;
        const start = (page - 1) * limit;
        const end = start + limit;
        const data = array.slice(start, end);
        const total = array.length;
        return this.createMeta(data, total, page, limit);
    }
}
exports.Pagination = Pagination;
