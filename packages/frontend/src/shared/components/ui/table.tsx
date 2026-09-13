import React from 'react';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hover?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  striped = false,
  hover = false,
  className = '',
  ...props
}) => (
  <div className="w-full overflow-x-auto">
    <table
      className={`
        w-full text-sm text-left
        ${className}
      `}
      {...props}
    >
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <thead className={`bg-gray-50 dark:bg-gray-700/50 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement> & {
  striped?: boolean;
  hover?: boolean;
}> = ({
  children,
  striped = false,
  hover = false,
  className = '',
  ...props
}) => (
  <tr
    className={`
      ${striped ? 'even:bg-gray-50 dark:even:bg-gray-700/30' : ''}
      ${hover ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
      ${className}
    `}
    {...props}
  >
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <th
    className={`
      px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
      ${className}
    `}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <td
    className={`px-4 py-3 text-gray-900 dark:text-gray-300 ${className}`}
    {...props}
  >
    {children}
  </td>
);
